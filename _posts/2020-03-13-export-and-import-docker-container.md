---
title: 실행 중인 Docker 컨테이너를 파일로 저장하고 다시 불러오기
tags: [Docker, Linux]
layout: post
comments: true
---

[이전 글]([/setup-virtual-environment-for-guests-with-docker/])에서는 Docker를 사용해 게스트 유저가 서버를 운영할 수 있는 가상 환경을 만드는 것을 했다. 그런데 이전 글을 잘 보면 Volume 설정을 하지 않아 컨테이너를 종료하면 컨테이너 내의 모든 작업 내역이 유실된다.

모든 데이터를 보존하려 아래와 같이 컨테이너의 루트 디렉터리를 호스트와 공유하여 데이터를 동기화해보는 방법을 시도할 수는 있겠지만,
```sh
docker run -dit -v ~/guest1:/ ubuntu:18.04
```

아래와 같이 루트 디렉터리는 볼륨으로 바인딩 할 수 없다는 오류를 볼 수 있다.
```
docker: Error response from daemon: invalid volume specification: '/home/ubuntu/guest1:/': invalid mount config for type "bind": invalid specification: destination can't be '/'.
```

bind mount를 하거나 tmpfs mount를 해도 결과는 같다.
```sh
docker run -dit --mount type=bind,source=~/guest1,target=/ ubuntu:18.04
# or
docker run -dit --tmpfs / ubuntu:18.04
```

그렇다면 어떻게 해결할 수 있을까? Docker는 여러 명령어를 지원하는데 `export`와 `import` 명령어를 사용하면 이 문제를 *어느 정도* 해결 할 수 있다.

정확히 말하면 위의 방법들처럼 실제 데이터를 호스트와 공유하는 것이 아닌, 특정 시점의 컨테이너 파일 시스템을 파일로 저장하고 불러오는 방법이다.


먼저 컨테이너를 파일로 저장하는 방법은 아래와 같다. `export` 명령어를 사용하여 컨테이너의 파일 시스템을 `guest1_export.tar` 파일로 아카이빙 할 수 있다.
```sh
docker export [CONTAINER_NAME] > guest1_export.tar
```

그리고 `import` 명령어를 사용하여 다시 Docker 이미지로 불러올 수 있다. `guest1_export.tar` 파일을 사용하여 `ubuntu:imported` 이미지로 만드는 것이다.
```sh
docker import guest1_export.tar ubuntu:imported
```

이미지가 정상적으로 만들어진다면 아래와 같이 이미지를 실행해보자.
```sh
docker run -dit ubuntu:imported
```

정상적으로 실행되지 않고 아래와 같이 오류가 발생한다.
```sh
docker: Error response from daemon: No command specified.
```

그 이유는 우리는 컨테이너의 **파일 시스템**을 아카이빙 하고 다시 이미지로 만든 것이므로 Docker는 이 이미지의 엔트리포인트가 무엇인지 알지 못한다. 그래서 우리는 이렇게 만든 이미지를 실행할 때 엔트리 포인트를 직접 지정해주어야 한다.

아래와 같이 명령어 뒤에 엔트리포인트를 지정하면 정상적으로 컨테이너가 실행된다.
```sh
docker run -dit ubuntu:imported /bin/bash
```