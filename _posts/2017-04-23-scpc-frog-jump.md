---
layout: post
title: "SCPC'15 1차 예선 - 개구리 뛰기"
date: 2017-04-23
categories: Algorithm
comments: true
share: true
---

### 문제
[https://www.codeground.org/practice/practiceProbView.do?probId=11](https://www.codeground.org/practice/practiceProbView.do?probId=11)

### 풀이
자주 많이 보이는 문제 형식이다. 한번에 K 만큼 이동 할 수 있을 때 끝까지 가는 최소 횟수를 구하는 것이 목표이다. 처음 코드를 작성할 때는 문제를 제대로 읽지 않아 N과 돌들의 좌표 Ai, 그리고 K가 모두 1,000,000이하 인 줄 알았는데 작성하고 제출하니 40점을 받고 시간 초과가 발생했다는 피드백을 받았다. 이 코드는 K가 최소 1이므로 현재 좌표에서 K만큼 떨어진 곳 부터 한 번에 이동할 수 있는지 검사하며 총 이동 수를 계산하는 것이다.

```cpp
#include <cstdio>
int main(){
    int tc, T, N, i, j, K;
    setbuf(stdout, NULL);
    scanf("%d",&T);
    for(tc=1;tc<=T;tc++){
        int *arr;
        int step = 0;
        scanf("%d",&N);
        arr = new int[N+1];
        arr[0] = 0;
        for(i=1;i<=N;i++){
            scanf("%d",&j);
            arr[i] = j;
        }
        scanf("%d",&K);
        int cur = 0;
        printf("Case #%d\n",tc);

        for(;;){
            bool jumped = false;
            for(i=cur+K;i>cur;i--){
                if(i > N || arr[i] > arr[cur]+K) continue;
                jumped = true;
                cur = i;
                step++;
                break;
            }
            if(!jumped){
                printf("-1\n");
                break;
            }
            if(cur == N){
                printf("%d\n", step);
                break;
            }
        }
        delete[] arr;
    }
    return 0;
}
```

시간 초과 문제를 발견하자마자 바로 lower\_bound를 이용한 코드를 작성헀다. 먼저 lower\_bound를 찾은 뒤 lower\_bound의 위치까지 한 번에 갈 수 있는지 확인한다. 즉 `arr[lower_bound] > arr[current + K]`의 결과가 `false`라면 한 번에 갈 수 없다는 뜻이므로 lower\_bound의 값을 1 감소시킨다. 그 뒤 현재 위치와 lower\_bound가 같은지 확인한다. 만약 같다면 더 이상 K 범위 이내로 이동 할 수 있는 곳이 없다는 뜻이므로 -1을 출력하고 종료한다. 아니라면 현재 위치와 점프 위치를 갱신하고 끝에 도착하였는지 확인하는 과정을 반복한다.

### 코드

```cpp
#include <cstdio>
int main(){
    int tc, T, N, i, j, K;
    setbuf(stdout, NULL);
    scanf("%d",&T);
    for(tc=1;tc<=T;tc++){
        int *arr;
        int step = 0;
        scanf("%d",&N);
        arr = new int[N+1];
        arr[0] = 0;
        for(i=1;i<=N;i++){
            scanf("%d",&j);
            arr[i] = j;
        }
        scanf("%d",&K);
        int cur = 0;
        printf("Case #%d\n",tc);

        for(;;){
            bool jumped = false;
            int left, mid, right;
            left = cur;
            right = N;

            //lower_bound 찾기
            while(left < right){
                mid = (left+right)/2;
                if(arr[mid] >= arr[cur]+K)
                    right = mid;
                else
                    left = mid + 1;
            }
            //만약 lower_bound까지 한번에 갈 수 없다면 한 칸 덜 가기
            if(arr[right] > arr[cur]+K) right--;

            //다음에 갈 수 있는 위치가 없다면 -1을 출력하기
            if(right == cur){
                printf("-1\n");
                break;
            }
            //아니라면 현재 위치와 점프 횟수를 갱신하기
            cur = right;
            step++;

            //끝까지 갔다면 점프 횟수 출력
            if(arr[cur] == j){
                printf("%d\n", step);
                break;
            }
        }
        delete[] arr;
    }
    return 0;
}
```
