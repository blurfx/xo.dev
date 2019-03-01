---
title: Python 3 비동기 프로그래밍 (1/2) - Iterator, Generator, yield, Coroutine
tags: [Python]
layout: post
comments: true
---

*이 글은 Python 3.7을 기준으로 작성된 글입니다.*

Python 3는 Python 2에 비해 상당히 많은 부분이 바뀌었는데 그 중 하나가 비동기 처리 지원입니다. 3.0 버전부터 비동기 프로그래밍이 가능한 것은 아닙니다.

Python 3.4에서 `asyncio` 모듈이, 3.5에서 `async`/`await` 키워드가 추가되어 파이썬으로 비동기 프로그래밍을 하려면 3.4 이후의 버전을 사용해야합니다.

이 글에서는 비동기 프로그래밍을 하기 전에 알아야할 기본 개념들에 대해 정리 해보도록 하겠습니다.

## Iterator

이해를 돕기 위해 잠깐 Python 2를 기준으로 예를 들어보겠습니다.

Python 2는 두 수의 범위를 `range`와 `xrange`로 표현할 수 있습니다.

`xrange`는 Python 3의 `range`와 같지만 Python 2의 `range`는 지정한 범위에 있는 모든 원소를 리스트에 넣고 반환합니다. 예를 들어 `range(N)`를 호출하면 `[0, 1, 2, .., N-1]`인 리스트를 반환합니다. 이런 방식은 O(N)의 공간을 사용하게 되므로 N이 커질수록 메모리 낭비가 심해집니다.

이런 문제점을 해결하기 위해 만들어진 것이 바로 **Iterator** 입니다. Iterator는 한번에 모든 값을 리스트에 넣고 반환하는 방식이 아닌 매번 다음 값을 계산하여 호출 될 때마다 반환하는 방식을 사용합니다.

설명이 끝났으니 다시 Python 3로 넘어옵시다. 이제, Iterator는 어떻게 만들까요? 바로 아래와 같은 규칙을 따라 만들어주면 끝입니다.

- 특별 메소드 `__iter__`가 존재해야하며 호출 시 `__next__` 메소드를 가진 객체(Iterator Object)를 반환해야 합니다.
- `__next__`는 호출될 때마다 다음 값을 반환해야 합니다.

아래의 코드는 Python 3의 `range`를 흉내낸 Iterator입니다.

```python
class MyRange:

    def __init__(self, start, end=None, step=1):
        if end is None:
            end = start
            start = 0

        self.value = start
        self.end = end
        self.step = step

        # 변화값이 0이라면 무한 루프에 빠지게 되므로 미리 예외 처리를 해줍니다.
        if self.step == 0:
            raise ValueError('"step" must not be zero')

    def __iter__(self):
        return self

    def __next__(self):
        # Iteration이 끝나야 하는 경우를 step의 값에 따라 처리해줍니다.
        if (self.step > 0 and self.value < self.end) or (self.step < 0 and self.value > self.end):
            raise StopIteration

        # 반환할 값을 미리 변수에 담아둡니다.
        ret = self.value
        # 그리고 다음 값을 계산하고
        self.value += self.step
        # 아까 담아두었던 값을 반환해줍니다.
        return ret


for x in MyRange(10, 1, -1):
    print(x)
# output: 10 9 8 7 6 5 4 3 2

my_range = MyRange(1, 5, 2)
print(next(my_range))
# output: 1

print(next(my_range))
# output: 3

for x in MyRange(10):
    print(x)
# output: 0 1 2 3 4 5 6 7 8 9
```

## Generator와 yield

Generator 함수는 이름 그대로 값을 생성 해주는 함수입니다.

보통 함수들은 값을 반환하면 그 함수는 소멸됩니다. 다시 같은 함수를 호출하면 그 함수를 처음부터 다시 실행하고 값을 반환하죠. 하지만 Generator는 `yield`라는 키워드를 사용하여 조금 다르게 동작합니다.

`yield`는 `return`과 다르게 호출되면 함수를 나가는것이 아닌 일시적으로 실행을 멈추고 스코프를 탈출합니다. 그리고 다시 실행되면 그 다음 줄부터 다시 함수 실행을 이어나가죠.

아래 코드는 간단한 Generator 예제입니다. 과연 출력은 어떻게 될까요?

```python
def hello_world():
    yield 'Hello'
    print('Bar')
    yield 'World'


generator = hello_world()

print(next(generator))
print('Foo')
print(next(generator))
```

위 코드를 실행한 출력 결과는 아래와 같습니다.

```
Hello
Foo
Bar
World
```

결과를 통해서 코드의 주요 흐름을 정리하면 아래와 같겠네요!

1. Generator 호출
2. Hello를 출력하고, Generator는 대기
3. Foo 출력
4. Generator 호출
5. Bar 출력
6. World 출력

우리가 Iterator로 작성했던 `MyRange`를 Generator 함수로 훨씬 짧고 간결하게 작성할 수 있습니다.

```python
def my_range(start, end=None, step=1):
    if end is None:
        end = start
        start = 0

    value = start

    if step == 0:
        raise ValueError('"step" must not be zero')

    while (step > 0 and value < end) or (step < 0 and value > end):
        yield value
        value += step


for x in my_range(10, 1, -1):
    print(x)
# output: 10 9 8 7 6 5 4 3 2
```

## Coroutine

앞의 Generator를 구현하면서 `yield`를 사용하여 값을 가져오고 함수를 일시적으로 멈출 수 있다는 것을 알았습니다. 그런데 Generator에서 값을 지속적으로 넣어주고 싶다면 어떻게 해야할까요? 전역 변수를 사용할수도 있겠지만 좋은 방법은 아닙니다. 이럴때 `Coroutine`을 사용하여 문제를 해결 할 수 있습니다.

`Coroutine`은 `Generator-based Coroutine`과 `Native Coroutine`이 있는데 이 글에서는 Generator-based Coroutine만 알아봅시다.

### Generator-based Coroutine

Generator-based Coroutine은 Generator 객체의 `send()`메서드를 호출하여 만들 수 있습니다. 위에서 만들었던 hello_word Generator를 Couroutine으로 바꾸면 아래와 같아집니다.

```python
def hello_world():

    name = yield 'Hello'
    yield name + '!'


generator = hello_world()
print(next(generator))
print(generator.send('Coroutine'))
# output: Hello Coroutine!
```