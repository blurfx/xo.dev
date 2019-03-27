---
title: GitLab Runner에서 Docker in Docker 사용하기
tags: [Linux]
layout: post
comments: true
---

GitLab Runner에서 Executor를 Docker로 설정해놓고, CI/CD 파이프라인에서 사용하는 Alpine Linux(혹은 다른 Linux 배포판 이미지) 내에서 Docker를 사용해야 하는 경우가 생겨서 단순하게 해당 Linux 이미지 내에서 Docker를 설치하고 사용하는 방식으로 CI 설정 파일을 작성했는데 Linux 이미지 내에서 Docker daemon이 켜지지 않는 문제가 있었다.

Docker daemon 실행 시 받은 오류는 아래와 같다.
```
Error starting daemon: Error initializing network controller: error obtaining controller instance: failed to create NAT chain DOCKER: iptables failed: iptables -t nat -N DOCKER: iptables v1.6.2: can't initialize iptables table `nat': Permission denied (you must be root)
Perhaps iptables or your kernel needs to be upgraded.
(exit status 3)
```

하지만 GitLab Runner의 privileged 설정은 이미 켜져있어서 권한 문제는 아니라는 생각이 들었고, 조금 검색해보니 Linux 내의 Docker와 호스트 Docker가 같은 소켓을 사용하여 해결할 수 있다는 [글](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/)을 찾았다.

위 설정을 적용하려면 GitLab Runner의 설정 파일을 열어 `runners.docker` 섹션의 `volumes` 값에 `var/run/docker.sock:/var/run/docker.sock`를 추가해주면 된다.
```toml
...
[[runners]]
 name = "[GITLAB_RUNNER_NAME]"
 url = "[YOUR_GITLAB_ADDRESS]"
 token = "[TOKEN]"
 executor = "docker"
 [runners.docker]
   tls_verify = false
   image = "alpine:latest"
   cap_add = ["NET_ADMIN"]
   privileged = true
   disable_entrypoint_overwrite = false
   oom_kill_disable = false
   disable_cache = false
   volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
...
```