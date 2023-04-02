---
title: Python의 Global Interpreter Lock(GIL)
date: "2019-05-31"
tags: [Python]
---

파이썬은 느립니다. 다른 언어들에 비하면 정말 많이 느립니다. 동적 타입 시스템을 사용하며 인터프리터 언어라는 것만으로도 충분히 설명이 가능하지만 파이썬을 느리게 만드는 원인이 하나 더 있습니다.
바로 Global Interpreter Lock(GIL) 때문입니다. 대체 GIL이 무엇이길래 파이썬을 느리게 만들고, Python은 왜 GIL을 사용할까요?

## Thread safety

우선 GIL에 대해 알아보기 전에 몇 가지 알아야 할 것들이 있습니다. 그 첫 번째로 `Thread Safety`를 먼저 예제로 알아봅시다.

만약 어떤 프로세스 내에 2개의 스레드 A, B가 존재한다고 가정해 봅시다. 두 스레드는 각각 아래와 같은 일을 합니다.
- 스레드 A: 전역 변수 `x`의 값을 N번 1 증가 시킨다.
- 스레드 B: 전역 변수 `x`의 값을 N번 1 감소 시킨다.

만약 우리가 따로 스레드에 어떤 관리를 해주지 않고 두 스레드를 동시에 시작시키면, `x`의 값은 몇이 될까요? 아래 코드로 직접 확인해봅시다.

```python
from threading import Thread

x = 0
N = 1000000

def add():
	global x
	for i in range(N):
		x += 1

def subtract():
	global x
	for i in range(N):
		x -= 1


add_thread = Thread(target=add)
subtract_thread = Thread(target=subtract)

# 스레드를 시작한다
add_thread.start()
subtract_thread.start()

# 스레드의 작업이 끝날때까지 대기한다
add_thread.join()
subtract_thread.join()

print(x)
```

놀랍게도 출력은 0이 아닙니다. 게다가 코드를 실행시킬 때마다 매번 다른 값을 출력합니다. 대체 왜일까요?

여러 스레드가 공용 자원(Shared Data)에 접근하려고 할 때 스레드들은 어떤 스레드가 데이터에 접근할지 경쟁하게 되는데 이 상황을 *경쟁 상황(Race Condition)*이라 합니다.

만약, 우리가 스레드를 관리해주지 않는다면 어떤 스레드가 데이터에 접근할지는 예측할 수 없으므로 우리는 스레드를 잘 관리해주어야 합니다. 그래서 우리는 스레드들이 Race Condition을 발생시키지 않으며 각자의 일을 잘 수행할 수 있는 *Thread Safety* 한 환경을 만들어 주어야 합니다.

위 코드에서 우리는 한 번에 하나의 스레드만 실행될 수 있도록 수정하여 Race Condition을 없앨 수 있습니다.
```py
# add 스레드를 시작하고 끝날때 까지 대기한다
add_thread.start()
add_thread.join()


# subtract 스레드를 시작하고 끝날때 까지 대기한다
subtract_thread.start()
subtract_thread.join()

print(x)
# >> 0
```

## Mutual Exclusion

어떻게 Race Condition이 일어나지 않게 하여 Thread Safety 한 상황을 만들 수 있을까요? 바로 공유 객체에 한 스레드만 접근하도록 스레드들을 동기화시켜주면 됩니다. 그리고 이 방법을 *상호 배제(Mutual Exclusion)* 방법이라 합니다.

Mutex를 사용할 때, 스레드에서 공유 객체에 접근하는 부분인 *임계 영역(Critical Section)*을 지정하고 Lock을 해야 합니다. Lock을 하면 Lock을 한 스레드만 공유 객체에 접근할 수 있고, Unlock을 해야 다른 스레드가 공유 객체에 접근할 수 있게 됩니다.

아래 코드는 위에서 결과가 제대로 나오지 않았던 코드에 Mutex를 적용하여 올바른 값이 나오도록 수정된 코드입니다.

각 Thread는 하나의 Mutex 객체를 공유하며 작업을 시작할 때 Mutex에 Lock을 걸어 다른 스레드가 공유 객체인 변수 `x`에 접근하지 못하도록 합니다.

그래서 먼저 시작된 `add_thread`의 작업이 끝날 때까지 `subtract_thread`는 대기하게 되고 `add_thread`의 작업이 끝나면 `subtract_thread`가 그때 작업을 시작하게 됩니다.

```python
from threading import Thread, Lock

x = 0
N = 1000000
mutex = Lock()

def add():
	global x
	mutex.acquire() # Mutex에 Lock을 걸어 다른 스레드가 접근하지 못하게합니다.
	for i in range(N):
		x += 1
	mutex.release() # Lock을 해제하여 다른 스레드가 접근 할 수 있도록 합니다.

def subtract():
	global x
	mutex.acquire()
	for i in range(N)
		x -= 1
	mutex.release()


add_thread = Thread(target=add)
subtract_thread = Thread(target=subtract)

# 스레드를 시작한다
add_thread.start()
subtract_thread.start()

# 스레드의 작업이 끝날때까지 대기한다
add_thread.join()
subtract_thread.join()

print(x)
```

## Reference Counting

Python의 공식 구현체인 CPython은 객체가 프로그램 내에서 몇 번이나 참조되고 있는지 세는 방법으로 메모리를 관리합니다. 한 번 아래 코드를 봅시다.

```
import sys
arr = []
arr_clone = arr
print(sys.getrefcount(arr)) # arr의 참조 횟수를 출력합니다.
```

위 코드의 출력은 3입니다. 빈 리스트 `[]`를 세 곳에서 참조하고 있다는 뜻이 됩니다. 
- 처음 변수가 선언되었을 때 빈 리스트 객체를 하나 생성했으므로 1개
- arr_clone이 arr의 리스트 객체를 바라보게 했으므로 1개
- sys.getrefcount 함수 인자로 넘길 때 1개

그래서 sys.getrefcount(arr)가 끝난 뒤에 참조 횟수는 2가 됩니다. 실질적인 참조 횟수죠.

Python은 이런 방식으로 객체의 참조 횟수를 카운팅하고 참조 횟수가 0이 되면 가바지 컬렉터가 객체를 메모리에서 제거합니다.

## Global Interpreter Lock

이제 이 글의 주제인 GIL에 관해서 얘기해봅시다.

만약 파이썬이 스레드 동기화를 제대로 처리하지 않는다면 한 객체가 실행 시간에 10번 참조되고, 7번 참조 제거되는데 Race Condition에 의해 참조 횟수가 0이 되어버려 메모리에서 제거된다거나 혹은 제거되어야 할 객체가 제거되지 않는 현상이 발생할 수 있습니다.

하지만 위의 Mutex를 적용하면 각 객체마다 Mutex를 생성해주어야 할 것이고, 그렇게 되면 데드락이 발생할 수 있는 가능성이 커지게 되며 성능은 더 느려질 수 있습니다.

이 문제를 어떻게 해결해야 할까요? 바로 파이썬 인터프리터 자체를 잠가버리는 겁니다. 권한을 얻은 하나의 스레드만 코드를 계속 실행시킬 수 있게 하는 것이죠.

이 방법은 Context Switching 비용도 적으며, 구현에 있어서 효율적입니다. 대신 한 번에 한 스레드만이 코드를 실행시킬 수 있게 되니 멀티 스레드 환경에서는 성능 저하를 불러오는 문제가 있어 많은 Python 사용자들이 GIL을 싫어하는 이유이기도 합니다.

그렇다면, 왜 Python은 GIL을 선택했을까요? 더 나은 선택지가 있지 않았을까요? 있을 수 있긴 했을 겁니다. 다만, 그런 문제를 인식할 때쯤 이미 Python은 꽤 많은 사용자가 쓰고 있었습니다. Python은 `ctypes`라는 라이브러리로 C언어로 만들어진 공용 라이브러리나 정적 라이브러리를 불러와 사용할 수 있게 해주는데, 이미 C로 만들어진 모듈이 너무 많았습니다. 그래서 최대한 C로 개발된 모듈들의 코드를 손대게 하지 않는 방법을 찾게 되었고, 그 결과가 그냥 파이썬의 인터프리터를 잠가 버리는 방식이었던 것이죠.

애초에 멀티 스레드를 고려해서 Python을 만들면 되지 않았을까요? Python은 1991년에 처음 만들어졌는데 이때는 OS의 스레드라는 개념의 중요성이 낮았습니다. 당시의 하드웨어를 보면 스레드라는 걸 생각하며 무언가를 만들 환경이 아니었죠.

이게 Python이 GIL을 사용하는 이유이자 지금의 Python이 존재하게 된 이유입니다.
