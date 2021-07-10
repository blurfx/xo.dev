---
title: Python 3.8 업데이트 요약
date: "2019-10-17"
tags: [Python]
---

파이썬 3.8에서 변경된 사항 중 개발자에게 직접적으로 체감될 몇 가지 변경 사항을 요약해보았다.

# [대입 표현식](https://www.python.org/dev/peps/pep-0572/)

파이썬의 `=`는 구분자로 취급되어 조건문에 섞어서 사용할 수 없었는데, 대입 표현식을 사용하면 같은 코드를 조금 더 짧게 작성할 수 있다.

기존 코드:
```python
n = len(name)
if n > 9:
    # ...
```

대입 표현식을 사용한 코드
```python
if (n := len(name)) > 9:
    # ...
```

리스트 컴프리헨션에 사용한 예
```python
[text for x in data if (text := parse(x))]
```

# [위치 전용 매개 변수](https://www.python.org/dev/peps/pep-0570/)

기존에는 일반 매개 변수와 키워드 전용 매개 변수만 있었으나 위치 전용 매개 변수 문법(`/`)이 추가되었다.

```python
def foo(a, b, /, c, d, *, e, f)
```

`/`의 좌측에 있는 매개 변수 `a`, `b`는 위치 전용 매개 변수가 되며, `c`, `d`는 위치 혹은 키워드 매개 변수일 수 있으며, `e`와 `f`는 키워드 전용 매개 변수가 된다.

그래서 `foo(1, 2, c=3, d=4, e=5, f=6)`은 올바른 호출이지만 `foo(1, b=2,  c=3, d=4, e=5, f=6)`는 올바르지 않다.

# typing

## [Final decorator, annotation](https://www.python.org/dev/peps/pep-0591)

자바를 사용해본 적 있는 개발자라면 익숙할 `final` 키워드가 파이썬에도 들어왔다. 단, 파이썬에는 키워드가 아닌 데코레이터와 타입 힌팅의 모습으로 추가되었다.

단, `typing` 모듈이 그렇듯이 실제 코드에는 영향이 없으면 정작 타입 검사기를 사용해야 원하는 결과를 얻을 수 있다.

```python
from typing import final


@final
class Person:
    # ...


# 오류: Person 클래스는 @final로 디코레이팅 되었으므로 상속받을 수 없다.
class Student(Person):
    #...
```

```python
from typing import final


class Person:

    @final
    def eat(self, food) -> None:
        # ...


class Student(Person):
    # 오류: eat 함수는 부모 클래스에서 @final로 디코레이팅 되었으므로 오버라이딩 할 수 없다.
    def eat(self, food) -> None
        # ...
```

객체에는 `Final` 어노테이션을 사용하면 된다.
```python
from typing import Final


name: Final[str] = 'blurfx'
# 혹은 name: Final = 'blurfx'
```

## [리터럴 타입](https://www.python.org/dev/peps/pep-0586/)

기존에는 객체가 어떤 *타입*을 가질지 어노테이션은 가능 했지만, 어떤 *값*을 가질지에 대한 어노테이션은 불가능했다. 리터럴 타입은 값에 대한 힌팅을 지원한다.

```python
MODE = Literal['r', 'rb', 'w', 'wb']
# open_file 함수의 mode 인자는 'r', 'rb', 'w', 'wb'값만 허용한다
def open_file(filepath: str, mode: MODE) -> str:
    # ...

# 정상
open_file('resume.pdf', 'r')

# 오류
open_file('resume.pdf', 'qwerty')
```

## [타입 지정된 딕셔너리](https://www.python.org/dev/peps/pep-0589/)

기존 딕셔너리에 대한 타입 힌팅은 키와 값에 대한 단일 타입 힌팅만 가능했다. 이번에 추가된 타입 지정된 딕셔너리(TypedDict)는 고정된 키만 허용하도록 하며, 각 키가 서로 다른 타입의 값을 가질 수 있도록 한다.

```python
from typing import TypedDict


class Person(TypedDict):
    name: str
    age: int

# 정상
me: Person = {
    'name': 'changhui lee',
    'age': 24
}

# 오류: TypedDict에 선언되지 않은 키 'country'가 있음
me: Person = {
    'name': 'changhui lee',
    'age': 24,
    'country': 'South Korea'
}
```

클래스 기반 문법이므로 상속을 통한 타입 확장도 가능하다.
```python
from typing import TypedDict


class Person(TypedDict):
    name: str
    age: int


class Student(Person):
    school: str

```

또한 이전 버전과의 호환을 위해 대체 문법도 지원한다.

```python
Person = TypedDict('Person', name=str, age=int)
Person = TypedDict('Person', {'name': str, 'age': int})
```


# f-string 자가 표현식

파이썬 3에 추가된 f-string은 문자열 포맷팅을 더 편리하게 만들었지만, 이번에 생긴 자가 표현식을 통해 더 편리해졌다.

기존의 이런 코드들은
```python
logging.info(f'name={name}, age={age}')
```

이렇게 대체될 수 있다.
```python
logging.info(f'{name=}, {age=}')
```

기존 f-string의 포맷팅 문법과 함수도 사용할수 있다.
```python
def to_lower(text):
    return text.lower()

logging.info(f'{lower(name)=}, {age=:,}')
```

---

더 자세한 내용은 [Python 3.8 Relase Note](https://www.python.org/downloads/release/python-380/)를 참고하자.