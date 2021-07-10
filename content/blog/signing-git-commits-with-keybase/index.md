---
title: Keybase로 Git 커밋 서명하기
date: "2021-03-13"
tags: [Git]
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

# GitHub에 공개키 추가하기

먼저 Keybase에서 공개키를 추출하여 복사한다.
```sh
keybase pgp export
```

그 다음, GitHub의 [키 설정 페이지](https://github.com/settings/keys)에 접속하고, `New GPG Key` 버튼을 눌러 키 등록 페이지로 들어간다.

그 후 앞에서 복사한 공개키를 붙여넣으면 된다.

이 과정이 필요한 이유는 GitHub에서 서명된 커밋에 사용된 키가 실제로 유저의 공개키와 맞는지 확인하기 위함이다.

만약 이 작업을 진행하지 않는다면 서명된 커밋을 해도 `Unverifed`라 나오게된다.


## Troubleshooting

macOS의 문제인지는 모르겠지만, 커밋 메시지 작성 후 서명을 하려고 하면 `gpg`에서 데이터를 서명하는데 실패했다는 오류가 발생한다.

이 경우 터미널에 `export GPG_TTY=$(tty)` 명령어를 실행하면 잘 작동한다.

*2021. 04. 14. 추가*

StackOverflow에 같은 문제에 관한 [질문](https://stackoverflow.com/questions/39494631/gpg-failed-to-sign-the-data-fatal-failed-to-write-commit-object-git-2-10-0)이 올라와 있어 해결 방법을 소개한다.

먼저 `gpg`를 업데이트 하고, symlink를 다시 생성한다.

```sh
brew upgrade gnupg
brew link --overwrite gnupg
```

그리고 Pinentry-mac을 설치한다.
```sh
brew install pinentry-mac
```

Pinentry-mac이 설치되었다면 `~/.gnupg/gpg-agent.conf` 파일에 아래 내용을 추가한다. 이미 pinentry-program이 설정되어 있다면 경로만 변경해준다.
```
pinentry-program /usr/local/bin/pinentry-mac
```

마지막으로 변경한 설정을 적용하기 위해 `killall gpg-agent` 명령어로 gpg-agent 데몬을 종료시킨다. 

이제 다음부터는 새 쉘 인스턴스가 실행될 때마다 `export GPG_TTY=$(tty)`를 할 필요가 없다.

