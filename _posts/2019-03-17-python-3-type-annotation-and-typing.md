---
title: Type Annotation, typing, mypy - 더 나은 Python 코드를 위해
tags: [Python]
layout: post
comments: true
---

Python은 변수의 타입이 언제든지 바뀔 수 있는 동적 타입 언어다.

동적 타입의 문제는 코드가 많아질수록 타입 체크가 힘들어진다는 것인데 Python은 그 문제를 해결하기 위해 Python 3.5에 Type Annotation 기능과 함께 `typing`이라는 내장 패키지를 추가했다.

Type Annotation이나 `typing` 패키지는 동적 타입인 파이썬을 정적 타입으로 만들어주지 않는다. 다만 변수나 함수 파라미터와 반환값이 어떤 타입인지 코드 상에서 명시할 수 있으며, 에디터 레벨에서 경고를 띄워줄 뿐이다.

## Type Annotation

아래는 Type Annotation을 적용한 함수다. add 함수의 인자 x, y가 정수형이라는 것과 `-> int` 표현식을 통해 함수의 반환값이 정수형이라는 것을 알 수 있다.
```python
def add(x: int, y: int) -> int:
    return x + y
```

만약 아래와 같이 add 함수의 인자를 문자열로 전달하면 무슨 일이 일어날까?
```python
print(add('sad', ' machine'))
```


\+ 연산자로 두 문자열이 연결되어 잘 출력된다. 어떠한 경고나 오류가 없다. 우리가 원하는 건 이 결과가 아닌데..
```
$ python3 app.py
sad machine
```

만약 PyCharm 같은 에디터를 사용한다면 아래와 같이 타입에 대한 경고를 보여준다.
![wrong type warning in PyCharm](/images/python-3-type-annotation-and-typing/type-warning.png)

하지만 Python을 쓰는 모두가 PyCharm을 사용하는 것은 아니며, 단순히 경고만 띄워주는 것으로는 동적 타입으로 인해 발생될 수 있는 문제들을 사전에 막기 힘들다. 어떻게 해결해야 할까?

## mypy

바로 [mypy](http://mypy-lang.org)라는 녀석을 쓰면 된다. pypi에 올라와 있는 패키지이므로 pip을 통하여 간단하게 설치할 수 있다.
```
pip3 install -U mypy
```

mypy를 통해 위의 코드를 실행시키면 아래와 같이 타입을 체크하고 문제가 있다면 오류를 발생시킨다. 만약 문제가 없다면 아무것도 출력되지 않는다.
```
$ mypy app.py 
app.py:5: error: Argument 1 to "add" has incompatible type "str"; expected "int"
app.py:5: error: Argument 2 to "add" has incompatible type "str"; expected "int"
```

## typing

만약 int, str과 같은 단순한 타입이 아닌 조금 더 복잡한 타입을 사용한다면 `typing` 패키지를 사용하면 된다.

만약 정수만 포함하는 리스트를 받는다면 아래와 같이 하면 된다. 딕셔너리(Dict)와 튜플(Tuple)도 가능하다.
```python
from typing import List


def add(x: List[int]) -> int:
    return sum(x)


print(add([1, 2, 3]))
```

### Type Aliases
`NewType`을 사용하여 타입에 별칭을 붙이는 것도 가능하다. 단순히 별칭을 만드는 것이기 때문에 실제 타입은 원형 타입으로 취급된다.
```python
from typing import List, NewType

UserId = NewType('UserId', int)
user_id = UserId(123)
print(user_id)
# 출력: 123
print(type(user_id))
# 출력: <class 'int'>


IdList = NewType('IdList', List[int])
id_list = [1, 2, 3]
print(IdList(id_list))
# 출력: [1, 2, 3]
print(type(id_list))
# 출력: <class 'list'>
```

### Callable
함수 인자에 다른 함수를 넘겨 줄 때는 `Callable`를 사용하면 된다. `Callable[[인자 타입 리스트], 반환 타입]`형식으로 사용할 수 있다.
```python
from typing import Callable


def add(x: int, y: int) -> int:
    return x + y


def subtract(x: int, y: int) -> int:
    return x - y


def call_func(x: int, y: int, func: Callable[[int, int], int]) -> int:
    return func(x, y)


call_func(10, 20, add)
call_func(10, 20, subtract)
```

아래의 경우는 인자로 받는 함수의 반환 타입은 int라 명시되어 있지만, 실제 인자로 받은 함수의 반환 타입이 float이기 때문에 mypy에서 오류를 발생시킨다.   
```python
def wrong(x: int, y: int) -> float:
    return float(x + y)


def call_func(x: int, y: int, func: Callable[[int, int], int]) -> int:
    return func(x, y)


call_func(10, 20, wrong)
```

### TypeVar, Union, Optional

`TypeVar`를 사용하면 제네릭 타입을 구현할 수 있다. 아래는 모든 요소가 같은 타입으로만 이루어진 Sequence를 전달받아 첫 번째 요소를 반환해주는 예제이다.
```python
from typing import TypeVar, Sequence

T = TypeVar('T')


def get_first_item(l: Sequence[T]) -> T:
    return l[0]


print(get_first_item([1, 2, 3, 4]))
print(get_first_item((2.0, 3.0, 4.0)))
print(get_first_item('ABC'))
```

여러 자료 형 중 하나를 받아야 할 때는 `TypeVar`에 여러 데이터 타입을 전달해주거나, `Union`을 사용하면 된다.
필수적인 인자가 아니라면(항상 값을 전달받지 않아도 된다면) `Optional`을 사용한다.
```python
from typing import TypeVar, Union, Optional


Numeric = TypeVar('Numeric', int, float)
Numeric2 = Union[int, float]
OptionalNumeric = Optional[int, float]

# Optional[T]는 Union[T, None]와 같다
```


## Conslusion


- `mypy` + `typing`을 사용하면 Python에서도 타입으로 인한 사이드 이펙트를 어느 정도 방지할 수 있다.
- 본문에는 적지 않았지만, Python 3.6부터는 함수 인자뿐만 아니라 변수들에게도 Type Annotation을 할 수 있다.
- 매번 `mypy ...py`를 해주는 건 귀찮은 일이다. `mypy`는 그래서 몇 에디터에 [플러그인](https://github.com/python/mypy#ide--linter-integrations)을 만들어 놓았으니 참고하자.
- `typing`에 대해 더 자세히 다루기에는 글이 너무 길어져서 일단 자주 사용되는 부분만 요약해보았다. 더 자세한건 [공식 문서](https://docs.python.org/ko/3.7/library/typing.html)를 보자.

