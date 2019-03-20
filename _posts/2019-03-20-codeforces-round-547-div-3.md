---
title: Codeforces Round #547 (Div. 3) 후기
tags: [Problem Solving]
layout: post
comments: true
---

[https://codeforces.com/contest/1141](https://codeforces.com/contest/1141)

## Task A

두 정수 n, m을 입력받고 n에 2 혹은 3을 계속 곱해가며 m을 만드는데 필요한 최소 연산 횟수를 구하는 문제. 재귀로 간단하게 풀었다.
```cpp
#include <iostream>
#include <algorithm>
using namespace std;
#define FASTIO ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define INF 987654321
int n, m;
int solve(int x, int step) {
    if (x > m) return INF;
    if (x == m) return step;
    return min(solve(x * 2, step + 1), solve(x * 3, step + 1));
}
int main() {
    FASTIO;
    
    cin >> n >> m;
    int ans = solve(n, 0);
    cout << (ans == INF ? -1 : ans);
}
```

## Task B

일하는 시간을 1, 쉬는 시간을 0으로 표현한 n개의 값들이 주어졌을때 한번에 최대로 쉬는 시간은 몇 시간인지 구하는 문제.
만약 입력이 `0 1 0`이라면 답은 1시간이 아닌 2시간이라는 함정이 있다. (다음 날까지 연속적으로 보아 `0 1 0 0 1 0`과 같이 최대 2시간을 쉴 수 있다)

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
#define FASTIO ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
int n, arr[400001];
int main() {
    FASTIO;
    int ans = 0, con = 0;
    cin >> n;
    for(int i = 0; i < n; ++i) {
        cin >> arr[i];
        arr[i + n] = arr[i];
    }

    for(int i = 0; i < n * 2; ++i) {
        if (arr[i]) {
            ++con;
        }
        else {
            con = 0;
        }
        ans = max(ans, con);
    }
    cout << ans;
}
```


## Task C

멍청하게 접근했다가 7번만에 맞은 문제.
원래 수열의 길이 N과 원래 수열의 각 원소와 그 다음 원소의 차이를 나타낸 N-1 길이의 수열 q가 주어질때 원래 수열을 출력하는 문제이다. 만약 여러 수열이 정답 조건에 만족한다면 아무거나 출력해도 된다.

내 풀이는 q수열의 연속합을 저장한다음 연속합 배열에서 가장 작은 값 - 1한 값을 다시 연속합 배열에 빼주는 것이다.

예를 들어 q배열이 `-2 1`일때 연속합 배열은 `0 -2 -1`이 될 것이고 가장 작은 값은 -2이므로 -2에서 1을 뺀 값인 -3을 다시 연속합 배열의 모든 원소에 빼주면 `3 1 2`가 된다.

그리고 문제 조건에 1부터 N까지의 모든 수가 한번씩 사용되어야 한다고 했으니 연속합 배열을 복사하여 정렬 후 검사했다.
```cpp
#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;
#define FASTIO ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define INF 987654321
int main()
{
    FASTIO;

    int n, k = INF;
    cin >> n;
    vector<int> arr(n - 1), sum(n);

    for(int i = 0; i < n - 1; ++i){
        cin >> arr[i];
    }

    sum[1] = arr[0];
    sum[0] = 0;

    for (int i = 2; i < n; ++i) {
        sum[i] = sum[i - 1] + arr[i - 1];
    }


    for(int i = 0; i < n; ++ i) {
        if (sum[i] < k)
            k = sum[i];
    }
    --k;

    for(int i = 0; i < n; ++ i) {
        sum[i] -= k;
    }

    vector<int> s(sum);
    bool isSorted = true;

    sort(s.begin(), s.end());
    int index = 0;
    while (isSorted && index < n - 1) {
        if (s[index] == s[index + 1] - 1) {
            index++;
        }
        else {
            isSorted = false;
        }
    }

    if (isSorted) {
        for(int i = 0; i < n; ++ i)
            cout << sum[i] << " ";
    }
    else {
        cout << -1;
    }
}
```


### Task D

영어 소문자와 물음표로만 이루어진 길이가 같은 두 문자열이 주어졌을때 두 문자열간 같은 문자 쌍을 최대로 만들며 그 문자들의 인덱스를 출력하는 문제다. 단, 물음표는 모든 문자랑 쌍을 이룰 수 있다.

각 문자들의 인덱스를 저장하는 두 개의 버킷을 만들고 그 곳에서 꺼내쓰는 방식으로 했는데.. 처음에 버킷을 `vector<int>`가 아닌 `vector<char>`로 선언해서 틀렸다. 멍청..

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
#define P pair<int, int>
#define FASTIO ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
int main() {
    FASTIO;

    int n;
    char c;

    cin >> n;
    vector<P> ans;
    vector<int> v[27], w[27];

    for(int i = 0; i < n; ++i) {
        cin >> c;
        if (c == '?') v[26].push_back(i + 1);
        else v[c - 'a'].push_back(i + 1);
    }

    for(int i = 0; i < n; ++i) {
        cin >> c;
        if (c == '?') w[26].push_back(i + 1);
        else w[c - 'a'].push_back(i + 1);
    }

    for(int i = 0; i < 26; ++i) {
        while(!v[i].empty() && !w[i].empty()){
            ans.push_back(P(v[i].back(), w[i].back()));
            v[i].pop_back();
            w[i].pop_back();
        }

        while (!v[i].empty() && !w[26].empty()) {
            ans.push_back(P(v[i].back(), w[26].back()));
            v[i].pop_back();
            w[26].pop_back();
        }

        while (!v[26].empty() && !w[i].empty()) {
            ans.push_back(P(v[26].back(), w[i].back()));
            v[26].pop_back();
            w[i].pop_back();
        }
    }

    while(!v[26].empty() && !w[26].empty()) {
        ans.push_back(P(v[26].back(), w[26].back()));
        w[26].pop_back();
        v[26].pop_back();
    }
    
    cout << ans.size() << '\n';
    for (P p : ans) cout << p.first << ' ' << p.second << '\n';
}
```

C에서 시간을 너무 많이 보내서 E번 이후로는 문제를 보지도 못했다. 다음에는 더 잘해야지..