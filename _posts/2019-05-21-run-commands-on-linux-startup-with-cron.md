---
title: Cron을 사용하여 리눅스 시스템 시작 시 명령어 실행하기
tags: [Web, CSS]
layout: post
comments: true
---

`@reboot`이라는 문자열을 명령어 앞에 붙이면 시스템 시작시 해당 명령어를 cron이 실행한다.

물론, cron 서비스가 시스템 시작시 실행되도록 설정되어 있어야 한다.

아래와 같은 식으로 작성하면 된다.
```
@reboot forever start /home/user/launch.json
0 1 * * * execute_me.sh
```

