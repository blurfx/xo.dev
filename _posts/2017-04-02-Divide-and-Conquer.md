---
layout: post
title: "분할 정복(Divide and Conquer)"
date: 2017-04-02
categories: Algorithm
comments: true
share: false
---

분할 정복은 가장 많이 쓰이는 알고리즘 패러다임 중 하나로 주어진 문제를 여러 문제로 분할하여 각 문제를 풀고 그 결과들을 이용하여 원래 문제를 푸는 방식을 말합니다. 분할 정복의 대표적인 예로 합병 정렬, 퀵 정렬, 이분 탐색 등이 있습니다.

합병 정렬을 예로 들어 분할 정복을 알아보겠습니다. 합병 정렬은 수열을 더 이상 나누어지지 않을때까지(수열이 길이가 1이 될 때까지) 계속 반으로 나눕니다.  수열의 길이가 1이 될때까지 나누는 이유는 길이가 1인 부분 수열은 값이 하나이기 때문에 그 상태는 '정렬 되어있다'라고 말할 수 있기 때문입니다.

합병 작업을 할때 투 포인터(Two Pointer) 알고리즘을 사용하여 두 부분 수열을 하나의 수열로 합병 정렬하는데 이 과정에서 두 수열은 항상 정렬되어 있어야 하기에 재귀 함수를 사용하여 작업을 처리합니다.

아래의 이미지는 위의 과정을 나타냅니다.

![]({{ site.url }}/assets/img/divideconquer/01.png)

위 이미지에 있는 수열을 사용하여 합병 정렬을 구현한 코드입니다. 재귀적으로 부분 수열을 분할하고 작은 부분 수열부터 정렬합니다. 정렬은 투 포인터 알고리즘을 사용하므로 정렬 할때는 결과를 임시 배열에 저장한 뒤 정렬이 끝나면 원래 배열에 값을 복사하여 정렬을 끝냅니다.

```c
#include <stdio.h>

int arr[7] = { 38, 27, 43, 3, 9, 82, 10 };

void merge_sort(int left, int right){
    int temp[7];
    int mid = (left + right) / 2, i, L, R;

    //Base Case : 만약 left가 right과 같거나 크다면(더 이상 나눌수 없는 경우) 바로 반환
    if(left >= right) return;

    //Divide : 배열을 절반으로 나누어 합병 정렬 함수를 재귀적으로 호출
    merge_sort(left, mid);
    merge_sort(mid + 1, right);

    //Conquer(Merge) : 분할하여 해결한 두 부분 수열을 다시 하나의 수열로 합친다
    for(i = left, L = left, R = mid + 1; L <= mid || R <= right; i++){
        //두 부분 수열에 아직 합병되지 않은 수가 남아 있거나, 두번째 부분 수열의 모든 수가 이미 합병되 었다면 첫번째 부분 수열에 남아 있는 수를 처리
        if((R <= right && L <= mid && arr[L] < arr[R]) || R > right)
            temp[i] = arr[L++];
        //위의 경우에 해당되지 않는다면 두번째 부분 수열에 남아 있는 수를 처리
        else
            temp[i] = arr[R++];
    }

    //위에서 처리한 수들을 원래 배열에 삽입함
    for(i = left; i <= right; i++)
        arr[i] = temp[i];
}

int main(){
    int i;
    printf("Before : ");
    for(int i = 0; i < 7; i++)
        printf("%d ", arr[i]);
    merge_sort(0, 6);
    printf("\nAfter : ");
    for(int i = 0; i < 7; i++)
        printf("%d ", arr[i]);
}

/*
RESULT

Before : 38 27 43 3 9 82 10
After : 3 9 10 27 38 43 82
*/
```
