---
title: WSL - Could not resolve hostname
date: "2021-01-09"
tags: [Linux]
---

WSL을 이용해서 `git pull`을 하니, github.com을 찾을 수 없다는 오류가 갑자기 발생했다.

```
$ git pull
ssh: Could not resolve hostname github.com: Temporary failure in name resolution
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and the repository exists.
```

하지만 웹 브라우저로 GitHub에 접속하니 잘 접속되는 것을 보고 내 인터넷 연결에는 문제가 없다고 생각했다. 그래서 `ping` 명령어를 이용해 핑을 날려보니 여전히 도메인 리졸빙에 실패했다고 나온다.
```
$ ping github.com
ping: github.com: Temporary failure in name resolution
```

도메인 리졸빙은 DNS가 담당하므로 DNS 서버에 문제가 있다고 생각했고, DNS를 변경하기로 했다. 나는 WSL에 Ubuntu 20.04를 사용하고 있으므로 이를 기준으로 작성한다.

먼저 WSL에서 DNS 설정은 WSL 실행 시 자동으로 설정된다. 그래서 수동으로 변경하려면 wsl 설정을 변경해 주어야 한다. `/etc/wsl.conf` 파일에 아래 내용을 추가하면 된다.

```ini
[network]
generateResolvConf = false
```

이후 `/etc/resolv.conf` 파일을 수정하여 DNS 설정을 변경한다. 나는 아래와 같이 Google DNS를 사용하는 것으로 변경했다.
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

마지막으로 윈도우 터미널에서 `wsl --shutdown` 명령어를 사용하여 wsl 인스턴스를 종료하고 다시 시작하면 된다.
