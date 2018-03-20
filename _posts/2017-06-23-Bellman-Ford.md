---
layout: post
title: "벨만-포드 알고리즘(Bellman-Ford Algorithm)"
date: 2017-06-23
categories: Algorithm
comments: true
share: true
---

다익스트라처럼 벨만-포드 알고리즘도 1개의 시작 정점을 기준으로 모든 정점까지 도달하는데 최단 거리를 구하는 알고리즘입니다. 하지만, 다익스트라와는 다르게 음수 간선이 포함되어 있어도 최단거리를 정상적으로 구할 수 있으며 음수 사이클이 있는지 또한 확인이 가능합니다. 다만, 다익스트라에 비해 속도가 느리므로 그래프에 음수 간선이 존재하지 않고 다익스트트라로 충분히 해결 가능한 문제라면 다익스트라를 사용하는 것이 더 효율적입니다.

벨만-포드는 다익스트라와 비슷하게 거리를 저장할 배열(dist)를 만들고 매번 거리를 갱신합니다. 차이점이 있다면 다익스트라는 우선순위 큐를 사용하여 연결된 가장 가까운 정점을 이용하여 정점의 거리를 갱신했다면 벨만-포드는 모든 간선을 여러번 확인하여 최단 거리를 갱신하는 방식입니다.

만약 간선 e가 있고 간선 e는 정점 u와 v를 잇는다고 할때 dist[v]가 dist[u] + weight[e]보다 크다면 지금까지 구한 정점 v로 가는 최단 경로보다 정점 u를 거쳐 가는 최단 경로가 더 빠르므로 이 때 최단 거리를 갱신해주면 됩니다. 시작점에서 임의의 정점 u로 가는데 거쳐야할 간선의 개수는 최대 V - 1개입니다. 그런데 벨만-포드는 위의 작업을 V번 반복합니다!

물론 V - 1번 작업을 반복해도 최단 거리는 충분히 구할 수 있습니다. 하지만 굳이 한번을 더 하는 이유는 음수 사이클의 존재를 확인하기 위한것인데, 음수 사이클이 있다는 것은 무한정 최단 거리가 갱신된다는 뜻이기 때문에 V - 1번 위 작업을 반복하여 최단 거리를 구했음에도 불고하고 한번 더 작업을 반복했을때 거리가 변경된다면 음수 사이클이 있다는 것을 의미합니다.

[BOJ 11657번 문제](http://boj.kr/11657)를 벨만-포드 알고리즘을 이용하여 해결하는 코드는 아래와 같습니다.

```cpp
#include <cstdio>
#include <vector>
#define INF 987654321
using namespace std;

/*
 간선 구조체 Edge 정의
 Edge->from : 간선의 시작 정점
 Edge->to   : 간선의 도착 정점
 Edge->cost : 간선의 가중치
*/
typedef struct Edge {
	int from, to, cost;
	Edge(int f, int t, int c) : from(f), to(t), cost(c) {}
} Edge;

int main() {
	int V, E;
  // 정점 수와 간선의 수를 입력받음
	scanf("%d%d", &V, &E);
	vector<Edge> edges;
  // 거리 배열을 INF 값으로 초기화
	vector<int> dist(V+1, INF);
	bool negative_path = false;
  //간선 정보를 입력받고 배열에 저장
	for (int i = 0; i < E; i++) {
		int u, v, c;
		scanf("%d%d%d", &u, &v, &c);
		edges.push_back(Edge(u, v, c));
	}
  // 시작 정점으로 가는 거리는 0이다
	dist[1] = 0;
  //최단 거리를 찾는 작업을 V번 반복한다
	for (int i = 0; i <= V; i++) {
    // 모든 간선을 확인한다
		for (int j = 0; j < E; j++) {
			int from = edges[j].from;
			int to = edges[j].to;
			int cost = edges[j].cost;
      // 정점 from에 대한 최단 거리가 이미 계산되었으며
      // 정점 from을 통해 정점 to로 가는것이 더 빠른 경우 거리를 갱신
			if (dist[from] != INF && dist[to] > dist[from] + cost) {
				dist[to] = dist[from] + cost;
        // 모든 정점에 대해 최단거리가 계산된 상태인데도 계속 값이 갱신된다면 음수 사이클이 존재함을 의미
				if (i == V) negative_path = true;
			}
		}
	}
  //정답 출력
	if (negative_path) printf("-1");
	else {
		for (int i = 2; i <= V; i++)
			printf("%d\n", dist[i] == INF ? -1 : dist[i]);
	}
}
```