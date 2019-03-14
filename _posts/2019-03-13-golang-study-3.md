---
title: Go 언어 스터디 - (3) 데이터 타입, 변수
tags: [Go]
layout: post
comments: true
---

*Go 언어를 공부하며 정리용으로 쓰는 글이니 틀린 부분이 있다면 알려주세요 :)*

*이 글은 Go 1.12 기준으로 작성되었습니다.*


## 변수

### 데이터 타입

정수형 타입은 정수 범위(크기)에 따라 여러 타입으로 나누어져 있다.

- int, int8, int16, int32, rune(=int32), int64
- uint, uint8, byte(=uint8), uint16, uint32, uint64, uintptr

주의해야 할 점은 int나 uint, uintptr은 시스템이 32비트인지 64비트인지에 따라 크기가 결정된다. 그러므로 64비트 크기의 정수를 사용해야 하는 경우에는 int64/uint64로 타입을 명시해주는 것이 좋다.

아래 코드에서 `x`는 `int`로 추론되므로 32비트 정수인지 64비트 정수인지 코드만 보고 알 수 없지만, `y`는 `int64`로 명시하여 64비트 크기의 정수라는 것을 알 수 있다.
```go
var x = 123
var y int64 = 123
```

또한 컴파일 단계에서 발견할 수 있는 오버플로와 언더플로는 컴파일러가 발견하여 사전에 방지한다. 그러므로 아래 코드는  오류가 발생한다. 
```go
var x uint64 = -1
var y uint64 = 18446744073709551616
// error: constant -1 overflows uint64
```

참과 거짓을 나타내는 타입으로는 `bool`을 사용할 수 있으며 사용할 수 있는 값으로는 `true`, `false`가 있다. C/C++처럼 0, 1과 같은 정수형 값은 사용할 수 없다. 
```go
var isTrue bool = true
var isFalse bool = false
var hasError bool = 0 // 오류!
```


문자열 타입은 `string`이며, 큰따옴표(")로 감싸 표현할 수 있다.
```go
var str string = "Quick brown something blahblah"
var strTwo string = 'Error' # 오류! 문자열은 쌍따옴표로 묶여야한다.
```

문자를 저장하고 싶다면 `byte` 타입과 `rune` 타입을 사용하면 된다. 위에 나온 것처럼 `byte`는 `uint8`과 범위가 같아 아스키 문자를 표시할 때 주로 사용되며 `rune` 타입은 `int32`와 범위가 같아 유니코드 문자를 표시할 때 주로 사용된다.

단 문자는 기본적으로 정수형으로 저장되므로 출력할 때는 `Printf` 함수를 이용하여 문자형으로 출력해주어야 한다.
```go
var korGa rune = '가'
var korGa2 rune = 0xAC00
var korGa3 rune = 44032

var engA byte = 'A'
var engA2 byte = 65

fmt.Println(korGa, korGa2, korGa3, engA, engA2)
// 출력: 44032 44032 44032 65 65

fmt.Printf("%c %c %c %c %c", korGa, korGa2, korGa3, engA, engA2)
// 출력: 가 가 가 A A
```

실수형 데이터는 크기에 따라 `float32`, `float64` 타입을 사용하면 된다.

자주 사용하지는 않지만 복소수를 위한 타입 `complex64`, `complex128`가 있다. `실수부 + 허수부i` 표현식을 사용하거나 `complex()` 함수를 호출하거나, 타입의 생성자자를 사용하여 선언할수 있다. 또한 `real()` 함수를 사용하여 실수부 값을 가져올 수 있으며 `imag()` 함수를 사용하여 허수부 값을 가져올 수 있다.

```go
var cmplx1 = 10 + 20i              // complex128
var cmplx2 = complex64(20 + 30i)   // complex64
var cmplx3 = complex(30, 40)       // complex128

fmt.Println(cmplx1, real(cmplx1), imag(cmplx1))
// 출력: (10+20i) 10 20

fmt.Println(cmplx2, real(cmplx2), imag(cmplx2))
// 출력: (20+30i) 20 30

fmt.Println(cmplx3, real(cmplx3), imag(cmplx3))
// 출력: (30+40i) 30 40
```

C/C++에서 자주 사용하던 포인터 역시 지원한다. 선언된 변수명 앞에 &를 붙여 주소를 가져올수 있으며, 데이터 타입 앞에 *를 붙여 포인터 타입이라는 것을 명시할 수 있다.

```go
var a = 10
var x *int = &a
fmt.Println(x)
// 출력: // 0xc00009c000

fmt.Println(*x)
// 출력: 10
```

## 변수

### 변수 선언

변수는 아래와 같이 선언 가능하다. 아래는 int형 변수 x, y를 선언하고 y는 선언과 함께 값 99를 대입한 것이다.
```go
var x int
var y int = 99
```

여러 개의 변수들을 한 줄에 작성하여 한 번에 선언하는 것도 가능하다.
```go
var a, b string
var x, y int = 0, 99
```

### 타입 추론

Go는 타입 추론으로 변수의 데이터 타입을 결정한다. 그래서 위에서 선언한 변수 `y`는 아래와 같이 써도 문제가 없다(오히려 위와 같이 쓰면 경고를 띄운다).

```go
var y = 99
```

Python이나 Javascript와는 다르게 Go에서 한번 변수에 정해진 자료형은 변경될 수 없다. 그래서 아래와 같은 코드는 오류가 발생한다.

```go
var x = 1996
x = "1996" // int형으로 이미 자료형이 정해졌으므로 string으로 재할당 할 수 없다.
```


### 짧은 변수 선언

Go는 더 짧은 변수 선언도 지원한다. `:=` 문법을 사용해서 아래와 같이 가능하다.

```go
x, y := 10, 20
s := "안녕 =)"
```

### 배열

배열은 아래와 같이 선언할 수 있다. C/C++과 다르게 변수 선언 위치에 상관없이 값이 할당되지 않은 변수나 배열은 데이터 타입에 따라 0, false, 빈 문자열로 초기화된다.
```go
var arr [5]int
```


배열의 값들을 직접 초기화하고 싶다면 아래와 같이 하면 된다.
```go
var arr = [5]int{0, 1, 2, 3, 4}

fmt.Println(arr)
// 출력: [0 1 2 3 4]
```

아래와 같이 특정 값만 직접 초기화할 수 있다.
```go
var arr = [5]int{0: 4, 2: 9}

fmt.Println(arr)
// 출력: [4 0 9 0 0]
```


