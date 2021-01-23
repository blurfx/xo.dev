---
title: Go 언어 스터디 - (5) if, switch, for
tags: [Go]
layout: post
comments: true
---

## If Statement

가장 기본적인 if 문부터 살펴보자.
```go
x := 2
if x < 3 {
    fmt.Println("x is less than three <3")
}
// 출력:  x is less than three <3
```

여기서 주의해야 할 점은 조건문을 괄호로 감싸는 건 선택적이지만, 다른 언어와 다르게 if 문의 내용이 한 줄이라도 중괄호로 if 문의 스코프를 명시해주어야 한다는 것이다.

다시 말해 아래와 같은 코드는 잘못된 코드이다.
```go
if x < 3
    fmt.Println("x is less than three <3")
```

아래 코드도 잘못된 코드이다.
```go
if x < 3
{
    fmt.Println("x is less than three <3")
}
```

사실 위 코드는 얼핏 보면 정상적이지만, Go가 컴파일 할 때 구문 분석을 하면서 [단순한 규칙](https://golang.org/doc/effective_go.html#semicolons)을 따라 적절한 위치에 세미콜론을 붙이는데 이런 경우는 아래와 같이 해석될 여지가 있는 모호함이 있기 때문이다. 이 규칙은 if 문뿐만 아니라 함수 선언과 같은 다른 모든 부분에 적용되므로 주의해야 한다.
```go
if x < 3;
{
    fmt.Println("x is less than three <3");
};
```

### if - else if - else

else if와 else도 크게 다르지 않다.

```go
x := 3

if x < 3 {
    fmt.Println("x is less than three <3")
} else if x > 3 {
    fmt.Println("x is greater than three")
} else {
    fmt.Println("x is equal to three")
}
// 출력: x is equal to three
```


## Switch statement

switch문은 조금 다른데 다른 언어와 다르게 매 case마다 break를 해주지 않아도 되며, case의 순서를 지키지 않아도 된다. 아래 코드를 보면 default가 먼저 있으며 따로 break를 하지 않았지만 정상적인 결과가 출력되는 것을 볼 수 있다.

```go
value := 9

switch value {
default:
    fmt.Println("is zero or greater than 9")
case 2, 4, 6, 8:
    fmt.Println("is even number")
case 1, 3, 5, 7, 9:
    fmt.Println("is odd number")
}
//출력: is odd number
```

아래와 같이 바로 함수의 반환값을 새로운 변수에 할당하고 switch문에서 사용하는 것도 가능하다.

```go
func getPositiveNum() int {
	return 4
}

switch x := getPositiveNum(); {
case x < 0:
    fmt.Println("x is negative number")
default:
    fmt.Println("x is positive number")
}

// 출력: x is positive number
```

switch에 값을 넘기지 않고, 외부에 선언된 변수를 사용하는 것도 가능하다. 만약 여러 case의 조건을 만족한다면 가장 처음 조건을 만족한 case가 선택된다.

```go
x, y, z := 5, 20, 15

switch {
case x < y:
    fmt.Println("x is less than y")
case x < z:
    fmt.Println("x is less than z")
case x == 5:
    fmt.Println("x is equal to five")
}

// 출력: x is less than y
```

## For Statement

for 역시 기본적인 구조는 다른 언어와 같다. 아래는 0부터 9까지의 합을 구하는 간단한 코드이다.
```go
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}
fmt.Println(sum)
// 출력: 45
```

참고로 Go에서 `++`은 연산자가 아닌 명령문이므로 `++i`처럼 사용한다면 오류가 발생한다. 그러므로 아래와 같은 코드도 오류가 발생한다.

```go
// wrong
x := 1
y := x++

// correct
x := 1
x++
y := x
```

아래와 for 문의 일부분은 필요에 의해 생략할 수도 있다.
```go
sum := 0
for i := 0; i < 10; {
    sum += i
    i++
}
```

### no while, use for

Go에는 while이 없는 대신 for를 while처럼 사용할 수 있다.

```go
sum := 1
for sum < 1000 {
    sum += sum
}
fmt.Println(sum)
```

이 코드는 아래의 C/C++ 코드랑 같다.
```cpp
int sum = 1;
while(sum < 1000) {
    sum += sum;
}
```

아래와 같이 for에 조건을 넣지 않고 사용하는 것도 가능하다. 
```go
sum := 1
for {
    if sum >= 1000 {
        break
    }
    sum += sum
}
```