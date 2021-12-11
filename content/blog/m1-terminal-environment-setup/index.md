---
title: 애플 실리콘(M1) 터미널 환경 설정하기
date: "2021-12-12"
tags: [Shell]
---

새 맥북 프로를 구입하고, 터미널 환경을 다시 설정했다. 다만 이전에 쓰던 x86 환경이 아니다 보니 다른 점이  조금 있었는데, 다른 사람들에게 도움이 될까 싶어 기록을 남겨본다.

## Homebrew

가장 먼저 Homebrew를 설치했다. arm64용 Homebrew와 x86 Homebrew를 분리해서 설치했다.
```sh
# Install Homebrew at /opt/homebrew (for Apple Silicon)
arch -arm64e /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Homebrew at /usr/local (for Intel Rosetta 2)
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Zsh

그다음 Zsh 설정을 했다. zsh가 실행된 아키텍처 환경에 따라 PATH를 다르게 설정했고, x86 환경의 zsh와 arm64 환경의 zsh를 빠르게 실행하는 alias를 추가했다.

```sh
if [[ $(arch) == "arm64" ]]; then
  export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:$PATH"
else
  export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"
fi

alias za="arch -arch arm64e /bin/zsh"
alias zx="arch -arch x86_64 /bin/zsh"
```

## Powerlevel10k

[.p10k.zsh](https://github.com/blurfx/dotfiles/blob/dcc4afaf790e8c352e7ed55cb820b5a12fc571f9/.p10k.zsh)

Zsh 테마로 Powerlevel10k를 사용하는데, 터미널이 x86 환경인 경우에는 터미널 프롬프트에 무언가 표시를 해주고 싶었다.

그래서 Powerlevel10k의 커스텀 프롬프트를 만들었다. 일반적으로 홈 디렉터리에 위치하는 `.p10k.zsh`을 열어 아래의 함수를 추가하고 (어디에 넣을지 모르겠다면 파일 내에서 `prompt_example`을 찾아 그 근처에 두면 된다)
```sh
function prompt_arch() {
  if [[ $(arch) == "i386" ]]; then
   p10k segment -t '🐢'
  fi
}

function instant_prompt_arch() {
  prompt_arch
}
```

이후 `POWERLEVEL9K_LEFT_PROMPT_ELEMENTS` 리스트에 `arch`를 추가해 주면 된다. 그러면 이제 아래와 같이 x86 환경인 경우에는 귀여운 거북이가 나온다.

```sh
# arm64
~/personal/dotfiles main ❯

# x86
~/personal/dotfiles main 🐢 ❯
```

## Alacritty, tmux

[.alacritty.yml](https://github.com/blurfx/dotfiles/blob/dcc4afaf790e8c352e7ed55cb820b5a12fc571f9/.config/alacritty/alacritty.yml)

나는 터미널 에뮬레이터로 [Alacritty](https://github.com/alacritty/alacritty)를 쓰는데, Alacritty를 arm64 환경에서 사용하는 경우 직접 소스코드를 빌드 해서 사용하는 것을 추천한다. Homebrew나 GitHub 저장소에 배포된 미리 빌드 된 바이너리는 x86 아키텍처 대상으로만 빌드 되었기 때문인데, 미리 빌드 된 바이너리를 사용하는 경우 항상 쉘이 x86 환경으로 실행되는 문제가 있다.

Alacritty를 직접 빌드 하는 방법은 저장소의 [INSTALL.md](https://github.com/alacritty/alacritty/blob/master/INSTALL.md)를 참고하자.

그리고 tmux를 자주 사용하는 편이라 tmux를 쉘 시작 시에 같이 실행하도록 설정해놓는데, 이번에 새로 터미널 환경을 구성하며 Alacritty 설정에 [변경](https://github.com/blurfx/dotfiles/blob/dcc4afaf790e8c352e7ed55cb820b5a12fc571f9/.config/alacritty/alacritty.yml#L36)이 조금 필요했다.

원래는 아래와 같이 설정을 했으나,
```yaml
shell:
  program: /bin/zsh
  args:
    - -l
    - -c
    - tmux
```

아래처럼 arm64 Homebrew 바이너리 디렉토리에 있는 tmux 바이너리를 직접 바라보게 변경해야 했다. `where`나 `which` 명령어를 통해 tmux 바이너리의 경로를 찾아보면 아래와 같은 경로가 나왔지만 기존 설정을 사용하면 뭐가 문제인지 tmux가 바로 종료되더라.
```yaml
shell:
  program: /bin/zsh
  args:
    - -l
    - -c
    - /opt/homebrew/bin/tmux
```

이 외에 기존 설정에서 넘어가는데 크게 다른점은 없었다.

**참고한 자료**

- https://gist.github.com/kiding/d77a418b81a5871daddc76e5f0d6cf36