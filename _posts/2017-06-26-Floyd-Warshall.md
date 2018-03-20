---
layout: post
title: "플로이드-와샬 알고리즘(Floyd-Warshall Algorithm)"
date: 2017-06-20
categories: Algorithm
comments: true
share: false
---

앞에서 소개한 다익스트라와 벨만-포드는 한 시작점을 기준으로 다른 모든 정점에 대해 최단 거리를 구하는 알고리즘이었습니다. 플로이드-와샬은 두 알고리즘과는 다르게 모든 정점 사이의 최단 거리를 구하는 알고리즘입니다. 플로이드-와샬은 구현이 매우 쉬우며 음수 간선이 존재하여도 잘 동작한다는 것이 특징입니다.

플로이드-와샬은 모든 정점에 대해 정점 i,j,k가 있을때 i에서 j로 바로 가는 것보다 i에서 k로, k에서 j로 가는것이 더 빠른 경우일때 최단 거리를 갱신합니다. 그런데 이 작업을 모든 정점에 대해 해주어야 하므로 시간 복잡도는 O(V^3)가 됩니다.

플로이드-와샬의 구현은 아래와 같습니다.

```cpp
void floyd_warwhall() {
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++) {
                // 정점 i에서 k로 가는 경로와 k에서 j로 가는 경로가
                // 한번 이상 계산된 경우만 최단거리를 갱신할 수 있다.
                if (dist[i][k] == INT_MAX || dist[k][j] == INT_MAX) continue;
                // 만약 i에서 j로 바로 가는 것보다 i-k-j 순으로 가는 것이
                // 더 빠른 경로일때 최단 경로를 갱신한다.
                if (dist[i][j] > dist[i][k] + dist[k][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
}
```

위와 똑같은 코드를 사용하지는 않지만 플로이드-와샬 알고리즘을 사용하여 해결 할 수 있는 기초 문제는 아래와 같습니다.
+ [BOJ 11403 - 경로 찾기](https://www.acmicpc.net/problem/11403)
+ [BOJ 2606 - 바이러스](https://www.acmicpc.net/problem/2606)