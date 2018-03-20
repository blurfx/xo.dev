---
layout: post
title: "퇴각 검색(Backtracing, 백트래킹)"
date: 2017-04-10
categories: Algorithm
comments: true
share: false
---

흔히 백트래킹이라 부르는 퇴각 검색은 완전 탐색(Brute-Force)의 한 종류입니다. 퇴각 검색은 문제를 상태 공간 트리로 표현할 수 있을때 사용할 수 있는 기법으로, 답이 될 수 없는 상태의 노드는 가지치기를 하여 탐색 범위에서 제외하면서 검색하는 방식입니다.

여기서 답이 될 수 있는 가능성이 있는 상태를 유망하다(Promising)고 하며 그렇지 않은 경우는 유망하지 않다(Non-promising)라고 합니다.

가지치기란 유망하지 않은 노드와 그 하위 노드는 탐색 범위에서 제외시키는 것을 말합니다. 예를 들어 N개의 물건과 각 물건의 무게(항상 1 이상일 때)가 주어지고 그 중에서 M개를 골라 무게의 합이 K가 되는 모든 경우의 수를 구하는 문제가 있을때, 답을 구하는 과정에서 중간합이 K보다 큰 상태라면 여기서 몇 개를 더 골라도 항상 합은 K보다 커질 것이기 때문에 중간 합이 K보다 크다면 그 상태 의 노드와 하위 노드는 더 이상 탐색하지 않는 것입니다.

가장 대표적인 퇴각 검색 문제로는 [N-Queen 문제](https://www.acmicpc.net/problem/9663)가 있습니다. N*N 크기의 체스판 위에 N개의 퀸을 놓아 모든 퀸이 서로를 공격 할 수 없는 상태의 개수를 찾는 문제입니다. 이 문제를 해결하려면 단순히 모든 칸에 퀸을 놓으면 됩니다! 하지면 `N = 16`일때 모든 퀸을 놓을 수 있는 경우의 수는 16^16이 되기 때문에 절대 시간안에 해결 할 수 없습니다. 하지만 중간중간 유망하지 않은 노드를 제거하면 충분히 시간 내에 해결할 수 있을만큼 탐색 범위가 줄어듭니다.

N-Queen 문제에서 답의 유망함을 검사 하려면 어떻게 해야할까요? 퀸은 모든 방향으로 공격을 할 수 있기때문에 퀸을 게임판에 배치하기 전에 대각선, 가로 그리고 세로 방향에 퀸이 이미 존재하는지 확인해주면 됩니다. 그런데 검사를 Brute-Force하게 시간 초과가 발생하게 됩니다.

아래는 N-Queen 문제를 해결하는 소스 코드입니다.`isPromising` 함수는 인자로 입력 받은 좌표에 퀸을 놓은 뒤에 상태가 유망한지 검사하며 `solve` 함수는 유망성 검사와 함께 퀸을 배치하고 답을 계산하여 반환하는 함수입니다.

```cpp
#include <stdio.h>
int n, map[16][16]={0}; //0이면 빈칸 1이면 퀸이 놓인 칸
int ldiag[16*16], rdiag[16*16];

int isPromising(int y, int x){
    int i,j;
    // / 방향 대각선
    if(rdiag[y+x]) return 0;
    // \ 방향 대각선
    if(ldiag[n-y+x-1]) return 0;
    // 세로 검사
    for(i=0;i<=y;i++)
        if(map[i][x]) return 0;
    // 가로 검사
    for(i=0;i<=x;i++)
        if(map[y][i]) return 0;
    return 1;
}

int solve(int row){
    int col,ans = 0;
    //모든 칸에 퀸을 배치했다면 한가지 경우를 찾은 것이다
    if(row == n)
        return 1;

    for(col=0;col<n;col++){
        // [row, col] 위치에 퀸을 놓아도 문제가 없다면
        if(isPromising(row,col)){
            // 해당 위치에 퀸을 배치하고
            map[row][col] = rdiag[row+col] = ldiag[n-row+col-1] = 1;
            // 현재 상태를 기준으로 답을 찾아나간다
            ans += solve(row+1);
            // 현재 상태를 기준으로한 탐색을 끝냈다면 배치했던 퀸을 다시 제거한다
            map[row][col] = rdiag[row+col] = ldiag[n-row+col-1] = 0;
        }
    }
    return ans;
}

int main(){
    scanf("%d",&n);
    printf("%d\n",solve(0));
}
```