---
layout: post
title: "BOJ 16287 - Parcel (2018 ACM-ICPC Seoul Regional Online Qual F)"
date: 2018-11-09
categories: Algorithm
comments: true
share: true
---

[https://www.acmicpc.net/problem/16287](https://www.acmicpc.net/problem/16287)

### 풀이

N개의 소포 중 4개를 골라 무게 합이 w가 되는 조합이 있는지 검사하는 문제이다.

N이 최대 5000이므로 Naive하게 풀면 O(N^4)가 되므로 시간 제한에 걸린다.

주변에서 여러 방법으로 풀었는데 나는 수를 두 개씩 묶어 `std::pair`를 사용하여 풀었다.

먼저 모든 수를 입력 받은 뒤 수를 두 개씩 묶고 두 수의 합 `S = x + y`을 계산하여 `{S, { x, y } }` 형태의 pair를 배열에 저장한 후 `S`를 기준으로 정렬했다.

그리고 배열에서 pair `A`를 하나 고르고 `std::lower_bound`를 이용하여 `S`가 `w - A.S`인 pair `B`들을 순회하며 `A`의 `x, y` 와 `B`의 `x, y`가 모두 다른 쌍이 존재한다면 바로 YES를 출력하도록 했다.

### 코드
```cpp
#include <cstdio>
#include <utility>
#include <vector>
#include <algorithm>
#define P pair<int, pair<int, int>>
using namespace std;
int main() {
    int w, n, arr[5001];
    vector<P> v;
    scanf("%d%d", &w, &n);

    for (int i = 0; i < n; ++i) scanf("%d", &arr[i]);

    for (int i = 0; i < n - 1; ++i)
        for (int j = i + 1; j < n; ++j)
            v.push_back({ arr[i] + arr[j], { arr[i], arr[j] } });

    sort(v.begin(), v.end());

    for (auto p : v) {
        auto it = lower_bound(v.begin(), v.end(), P(w - p.first, {-1, -1}));
        while (it != v.end() && p.first + (*it).first == w) {
            if ((*it).second.first != p.second.first && (*it).second.first != p.second.second
                && (*it).second.second!= p.second.first && (*it).second.second != p.second.second) {
                puts("YES");
                return 0;
            }
            ++it;
        }
    }
    puts("NO");
}
```
