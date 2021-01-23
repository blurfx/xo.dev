---
title: 특정 Redis 데이터베이스의 모든 키 혹은 패턴과 일치하는 키를 삭제하는 방법 
tags: [Redis, Shell]
layout: post
comments: true
---

### 모든 키 삭제하기

모든 키를 삭제할 데이터베이스를 선택 후 `FLUSHDB` 명령어를 사용하면 된다.

redis-cli 밖에서 모든 키를 삭제하려고 한다면 아래 명령어를 사용하면 된다.

```sh
echo "FLUSHDB" | redis-cli -a '<REDIS_PASS>' -n <N>
```

### 패턴과 일치하는 키를 삭제하기

지금 사용하는 redis-cli에서 `FLUSHDB` 명령을 인식하지 못 해서 그냥 직접 여러 명령어를 파이프라이닝하여 특정 패턴과 일치하는 키를 삭제하는 명령어를 작성했다.

```sh
echo "KEYS *" | redis-cli -a '<REDIS_PASS>' -n <N> | awk '{printf("\"%s\" ",$1)}' | xargs -0 echo "DEL" | redis-cli -a '<REDIS_PASS>' -n <N>
```