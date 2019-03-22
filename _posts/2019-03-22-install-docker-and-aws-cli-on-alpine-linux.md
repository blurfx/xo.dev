---
title: Alpine Linux에 Docker와 AWS CLI 설치하기
tags: [Linux]
layout: post
comments: true
---

Alpine Linux는 작고 가볍고 보안을 중시한 리눅스 배포판으로 Docker 이미지가 5MB 정도밖에 되지 않는 것으로 유명하다.
그래서 리눅스 위에서 간단한 작업을 해야할 때 자주 사용하는데, 이번에 CI/CD 파이프라인을 구성하며 GitLab Runner에서 AWS ECR/ECS에 배포를 어떻게 할까 고민하다가 Alpine Linux 이미지에 Docker와 AWS CLI를 설치하여 사용하는 방법을 적용하기로 했다.

참고로 Alpine Linux는 `apk`(Alpine Linux package manager)라는 독자적인 패키지 관리 툴을 사용한다. 

Docker와 AWS CLI는 아래 명령어로 설치하면 된다.
```bash
# 패키지 레포지터리 업데이트
apk --no-cache update

# pip을 사용하기 위해 Python 3 설치, 그리고 Docker도 설치
apk --no-cache add python3 docker

# AWS CLI 설치
pip3 --no-cache-dir install awscli

# 설치 확인
docker --version
aws --version
```
