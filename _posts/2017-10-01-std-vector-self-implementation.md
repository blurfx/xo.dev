---
layout: post
title: "std::vector 직접 구현하기"
date: 2017-10-01
categories: Development
comments: true
share: false
---

알고리즘을 공부하고 여러 대회에 참여하고 시험을 보다보면 가끔씩 라이브러리 사용을 제한하는 곳이 있다. 예를들면 삼*이나 *성. 이런 경우 기존에 라이브러리를 많이 사용하던 사람들은 코드 작성이 매우 불편해진다.

특히 동적 배열인 `std::vector`의 편리함은 정적 배열이 따라올 수 없는데 `vector`는 짧은 시간에 비슷하게 구현할수 있으므로 직접 만들어 사용하는것도 나쁘지 않다.

```cpp
#include <cstdlib>
template <typename T>
class vector {
private:
    int _capacity = 0;
    int _size = 0;
    T *arr;
public:

    int capacity() { return _capacity; }
    int size() { return _size(); }
    bool empty() { return _size == 0; }
    int resize(int size) { realloc(arr, size); }
    int clear() { _size = 0; }

    int at(int position) { return arr[position]; };
    int front() { return arr[0]; }
    int back() { return arr[_size - 1]; }

    vector(int size = 1) {
        _capacity = size;
        arr = new T[size];
    }

    ~vector() {
        free(arr);
    }

    void push_back(T val) {
        if (_size == _capacity) {
            _capacity *= 2;
            arr  = (T*)realloc(arr, _capacity * sizeof(T));
        }
        arr[_size++] = val;
    }

    void pop_back() {
        _size--;
    }

    T operator[](int i) {
        return arr[i];
    }
};
```