---
title: Keybase로 Git 커밋 서명하기
tags: [Git, Keybase]
layout: post
comments: true
---

# GPG에 PGP 공개키-개인키 키페어 등록하기

먼저 Keybase CLI를 설치한다.

```sh
# 만약 gpg가 설치되어 있지 않다면 gpg를 먼저 설치하자.
brew install gpg

# Homebrew로 설치하는 keybase는 macOS만 지원하므로 다른 OS를 사용한다면 
# https://keybase.io/download 를 참고하자.
brew install --cask keybase
```

그리고 Keybase에 로그인한다.
```sh
keybase login
```

로그인 후 Keybase에 자신의 키가 있는지 확인하자.
```
keybase pgp list
```

만약 키가 없다면 키를 생성한다.
```
keybase pgp gen --multi
```

키가 이미 존재한다면 아래의 명령어로 `gpg`에 키를 불러온다.
```
keybase pgp export | gpg --import
keybase pgp export -s | gpg --allow-secret-key-import --import --batch
```

# `.gitconfig` 수정하기

먼저 아래 명령어로 자신의 PGP 키 ID를 가져온다.
```sh
gpg --list-secret-keys --keyid-format LONG
```

위 명령어로 나온 결과에서 아래의 XXXX..부분이 키 ID이다. 해당 부분을 복사한다.
```
sec   rsa4096/XXXXXXXXXXXXXXXX 2020-12-18 [SC] [expires: 2036-12-14]
```

이후 아래의 방법 중 하나로 `.gitconfig`를 수정한다.

A. CLI 명령어로 변경하기
```sh
git config --global user.signingkey XXXXXXXXXXXXXXXX
git config --global commit.gpgsign true
```

B. `.gitconfig` 파일을 직접 열고 아래 내용 추가하기 (보통 `~/.gitconfig`에 위치한다)
```ini
[user]
  signingkey = XXXXXXXXXXXXXXXX
[commit]
  gpgsign = true
```

이제 커밋을 할때마다 PGP키로 서명하는 프롬프트가 나오게된다.
