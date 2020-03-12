---
title: Docker로 한 서버를 여러 사람이 독립적으로 사용할 수 있는 환경 만들기
tags: [Docker, nginx, Linux]
layout: post
comments: true
---

몇 달 전부터 같이 알고리즘 문제를 푸는 친구들과 [panty.run](https://panty.run/)이라는 알고리즘 블로그를 운영하고 있다. 블로그를 운영하는 친구 중 한 명이 간단한 웹 게임을 만들고 라즈베리 파이를 사용하여 배포했는데 이걸 보고 팀 블로그를 운영하는 서버에 올릴 수 있게 하면 어떨까 하는 생각이 들었다.

그런데 팀 블로그는 이미 [Docker](https://www.docker.com)를 사용하여 컨테이너로 실행되고 있으며 해당 서버 인스턴스 역시 AWS를 사용하여 쉘 접속 시 키 파일이 필요한 상태였다.

그래서 '키 파일 없이 접속할 수 있으며 기존 환경을 해치지 않는 독립된 환경을 만들어 접속하게 할 수 있을까? 거기에 서버까지 띄워 외부에서 접속하게 할 수 있을까?'라는 의문이 들었고 실제로 해보니 가능했다. 이 글은 어떻게 환경을 구성했는지 기록을 남기기 위한 것이다.



먼저 가상 환경을 제공할 OS 이미지를 먼저 받자.
```sh
docker pull ubuntu:18.04
```

그다음 이미지를 실행시켜준다. 이때 ssh와 웹으로 접근하기 위해 22, 80, 443번 포트를 열어야 하는데 호스트의 포트를 그대로 사용할 수 없으니 나는 적당히 98xx, 9433 포트로 바인딩해 주었다. **꼭 이 포트가 아니어도 된다.**
```sh
docker run -dit -p 9822:22 -p 9880:80 -p 9443:443 --name [CONTAINER_NAME] ubuntu:18.04
```

이제 컨테이너 안으로 들어가 추가적인 설정을 해주어야 하므로 bash(혹은 sh)를 사용하여 컨테이너로 들어가자.
```sh
docker exec -it [CONTAINER_NAME] bash
```

패키지 매니저를 업데이트하고 기본적으로 필요한 패키지를 설치하자. `openssh-server`는 ssh로 접속할 수 있도록 해준다.
```sh
apt update
apt install vim openssh-server
```

이제 ssh로 접속할 수 있도록 설정을 변경해주자. 먼저 아래의 파일을 열고
```sh
vim /etc/ssh/sshd_config
```
파일에서 아래와 같이 주석처리 되어 있는 부분을 찾아주자.
```sh
#PermitRootLogin prohibit-password
```

> `PermitRootLogin` 옵션은 root 계정으로 접속 시 어떤 접속 방법을 허용/금지 시킬 것인지 설정하는 옵션이다. 기본값은 `prohibit-password`로 AWS처럼 키 파일이 있어야만 접속할 수 있도록 되어있다.

맨 앞에 붙어있는 `#`이 주석의 시작을 의미하므로 `#`은 제거하고, 옵션의 값은 `yes`로 바꿔 아래와 같이 수정한 후 저장한다.
```sh
PermitRootLogin yes
```

위 작업은 아래 명령어를 사용해 한번에 할 수 있다.
```
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
```

이제 아래 명령어를 통해 root계정의 비밀번호를 변경해주자. 실제 유저는 여기서 설정한 비밀번호로 접속을 할 것이다.
```sh
passwd root
```

이제 ssh 서버를 실행하여 ssh로 접근할 수 있도록 해주자.
```
service ssh start
```

그럼 이제 유저는 `ssh root@[인스턴스 IP 주소] -p 9822` 명령어로 위에서 설정한 비밀번호를 사용하여 접속할 수 있다.

하지만 아직 설정할 것이 더 남았다. 외부에서 특정 도메인으로 접속할 때 이 컨테이너로 연결을 포워딩 시켜주어야 한다.


`exit` 명령어를 사용하여 도커 컨테이너에서 나온 뒤 호스트에 설치되어 있는 nginx에 사이트 설정을 추가해주자. 나는 [s0af.panty.run](http://s0af.panty.run)이라는 주소로 접속할 때 우리가 방금 설정한 컨테이너로 연결시키려고 한다.

먼저 `/etc/nginx/sites-available/` 경로에 들어가 적당한 이름의 설정 파일을 만든 뒤 아래와 같이 원하는 도메인을 아까 설정했던 포트로 포워딩 시키도록 설정 파일을 작성해주자.

```sh
server {
        server_name s0af.panty.run;
        listen 80;

        location / {
                proxy_pass      http://127.0.0.1:9880;
                proxy_set_header    X-Real-IP $remote_addr;
                proxy_set_header    Host      $http_host;
                proxy_set_header X-Forwarded-Proto https;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        }

}

server {
        server_name s0af.panty.run;
        listen 443 ssl http2;

        location / {
                proxy_pass      http://127.0.0.1:9443;
                proxy_set_header    X-Real-IP $remote_addr;
                proxy_set_header    Host      $http_host;
                proxy_set_header X-Forwarded-Proto https;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        }

}
```

이후 설정 파일의 심볼릭 링크를 만들어준 뒤, nginx의 설정을 다시 불러오자. 만약 오류가 난다면 다시 한번 살펴보자.
```
ln -s /etc/nginx/sites-available/[파일이름] /etc/nginx/sites-enabled/[파일이름]

service nginx reload
```

이후 아래와 같이 외부에서 접근 할 수 있도록 인바운드 포트 설정을 해주고
![Screen capture of AWS network inbound configuration page](/images/setup-virtual-environment-for-guests-with-docker/aws.png)

마지막으로 도메인에 대한 DNS 레코드 설정까지 해주면 끝난다!
![Screen capture of Goddady DNS configuration page](/images/setup-virtual-environment-for-guests-with-docker/dns.png)