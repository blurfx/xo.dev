---
title: Python 3 Iterator와 Generator 그리고 Coroutine
date: "2019-03-01"
tags: [Python]
---

이 글에서는 Python을 쓰며 한번쯤을 들어 보았을법한 `Iterable`, `Iterator` 그리고 `Generator`에 대해 알아봅니다.

## Iterable

Iterable이란 객체가 가지고 있는 멤버들을 하나씩 반환할 수 있는, 쉽게 말해 `for ... in`문을 사용하여 모든 멤버에 반복적으로 접근할 수 있는 객체라 생각하면 됩니다.

쉬운 예로 Python의 대부분의 기본 컨테이너들(list, set, dict, tuple, str 등)은 기본적으로 Iterable합니다.

Python의 프로그래밍적 정의는 Iterator를 반환하는 특별 메소드 `__iter__`를 가지고 있는 객체를 뜻합니다. 그러므로 위에서 나열한 기본 컨테이너들 뿐만 아니라 직접 만든 객체라도 `__iter__`와 `__next__` 메소드가 정상적으로 구현이 되어 있다면 Itertaion이 가능합니다.

`__next__`함수는 호출 될 때마다 객체의 멤버들을 하나씩 반환하며 더 이상 반환할 멤버가 없다면 `StopIteration` 예외를 발생시킵니다. 이 과정을 `for ... in`문을 사용하면 아래와 같이 매우 간결하게 쓸 수 있습니다.

```python
for x in range(10):
    print(x)
```

조금 더 깊이 파볼까요? `for ... in`은 내부적으로 아래와 같은 방식으로 값을 계속 가져옵니다.
```python
# iter 함수는 인자로 들어온 객체의 `__iter__`를 호출하여 i/terator를 반환합니다.
# 그래서 변수 range_iter는 range(10)의 iterator가 됩니다.
range_iter = iter(range(10))

while True:
    try:
        # next 함수는 Iterator의 `__next__`를 호출하여 객체의 다음 멤버을 가져옵니다.
        x = next(range_iter)
        print(x)
    except StopIteration:
        break
```

아, `__init__`과 `__next__`의 구현은 어떻게 하냐구요? 그건 이제 설명할겁니다.

## Iterator

앞에서 설명한 Iterable 객체는 `__iter__` 메소드가 구현된 객체라고 설명했었죠? Iterator는 `__next__` 메소드가 구현된 객체를 말합니다.
많은 경우 `__iter__`와 `__next__`모두 같은 객체에 구현해서 씁니다. `__iter__`는 `__next__`가 구현된 객체를 반환해주기만 하면 되니 같은 객체에 `__next__`를 구현했다면 객체 자기 자신을 반환해주면 되거든요!

아래의 코드는 `range`를 흉내낸 Iterator입니다.

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

간단하죠?


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

`Coroutine`은 `Generator-based Coroutine`과 `Native Coroutine` 그리고  있는데 이 글에서는 Generator-based Coroutine만 알아봅시다.

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