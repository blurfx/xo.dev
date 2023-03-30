---
title: Go 언어 스터디 - (1) Go 설치, 개발 환경 설정하기
date: "2019-03-11"
tags: [Go]
---

*이 시리즈는 Go 언어를 공부하며 정리용으로 쓰는 글입니다. 틀린 부분이 있다면 알려주세요 :)*
*Go 1.12를 기준으로 합니다.*


먼저 Go를 먼저 설치하자. [https://golang.org/dl/](https://golang.org/dl/)에서 자신의 OS에 맞는 설치 바이너리를 내려받아 설치하면 된다.

macOS에서는 [Homebrew](https://brew.sh)를 사용하여 조금 더 편하게 설치할 수 있다. 아래 명령어로 설치하면 된다:

```sh
brew install go
```


### 개발 환경 설정

[VSCode](https://code.visualstudio.com) 코드를 기준으로 설명한다.


1. 먼저 `Go` 확장을 설치한다.
![Install Go Exntension](/images/golang-study-1/vscode-extension.png)


2. `.go` 확장자의 파일을 하나 새로 만든다. 혹은 새 파일을 만들고 <kbd>Ctrl(⌘)</kbd>+<kbd>K</kbd>+<kbd>M</kbd>를 입력하여 `Go`를 선택해도 된다.


3. VSCode 화면 우측 하단을 보면 아래와 같이 **Analysis Tools Missing**이라는 알림이 뜨는데, 이 알림을 클릭하고 `Install`을 눌러 VSCode에서 Go를 사용하는데 필요한 서드파티 툴들을 설치한다. 어떤 툴들이 설치되고 각 툴이 어떤 일을 하는지 궁금하다면 [이곳](https://github.com/Microsoft/vscode-go/wiki/Go-tools-that-the-Go-extension-depends-on)에서 확인할 수 있다.
![Install Go Analysis Tools](/images/golang-study-1/install-go-tools.png)


4. 아래와 같은 메시지가 나오면 성공적으로 설치가 완료된 것이다.
![Install Go Analysis Tools](/images/golang-study-1/go-tools-install-log.png)


### Hello, World!

프로그래밍 언어를 배울 때마다 처음 하기 좋은 건 역시 "Hello, World!" 출력하기다. 별거 아닌 것 같아 보여도 기본적인 문법과 구조를 예측할 수 있다. Go로 작성한 Hello World는 아래와 같이 생겼다. :)

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!");
}
```

이 코드를 `적당한 이름.go`로 저장하고 VSCode에서 <kbd>F5</kbd>를 눌러 디버깅을 하면 Go로 작성한 첫 프로그램 완성!

![Hello World in Go](/images/golang-study-1/hello-world.png)

CLI 환경에서는 `go run FILENAME.go` 명령어로 실행하면 된다.

![Hello World in Go](/images/golang-study-1/run-go-in-cli.png)
