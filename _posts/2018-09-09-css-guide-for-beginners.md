---
layout: post
title: "CSS 초보자를 위한 간단한 가이드"
date: 2018-09-09
categories: Web
comments: true
share: true
---

웹 프론트엔드 개발을 시작하면 CSS는 당신을 프로젝트가 끝날때까지 괴롭힐 것이다. 이 글에서는 CSS를 사용하기 시작한지 얼마 되지 않은 사람들을 위해 몇 가지 알아야 할 사항을 알려줄것이다.

#### 선택자의 우선순위
CSS를 작성하다보면 어떤 요소는 여러 개의 스타일이 겹치며 생각했던 것과 스타일이 다르게 적용될 것이다. 이 경우는 CSS 선택자의 우선순위에 따라 적용된 것인데, 이런 경우를 최대한 피하기 위하여 우리는 선택자의 우선순위를 알아야 할 필요가 있다.

| 순위 | 선택자                                        |
| -- | ------------------------------------------ |
| 1  | !important                                 |
| 2  | 인라인 스타일                                    |
| 3  | ID 선택자                                     |
| 4  | Class, Pseudo-class(i.e. ::before), 속성 선택자 |
| 5  | 태그 선택자                                     |
| 6  | 전체 선택자 (*)                                 |

또한 선택자의 우선 순위 외에도 먼저 정의된 (코드 상으로 위쪽에 정의되어 있는) 것이 더 우선 순위가 높다.

##### More Detail

더 자세히 알아보자. 
```css
.red {
  color: red;
}
.blue {
  color: blue;
}
```
```html
<p class="red blue">Apple</p>
<p class="blue red">Banana</p>
```
위와 같은 코드가 있을때 결과는 어떻게 될까? red와 blue 클래스 모두 같은 우선 순위이므로 나중에 적용된 클래스의 속성이 사용된다. 그러므로 파란 Apple과 빨간 Banana가 화면에 표시 될것이다.

다른 예제를 보자.

```css
.red p {
  color: red;
}
.blue p {
  color: blue;
}
```
```html
<div class="blue">
  <p>Apple</p>
  <div class="red">
    <p>Banana</p>
  </div>
</div>
```

위의 예제와는 달리 조금 헷갈릴 것이다. 코드만 보면 파란 Apple과 빨간 Banana가 나올 것 같은데, 사실은 다 파란색으로 나온다. 


#### 피해야 할 것들

##### !important

!important는 실무에서 최대한 피하는 것이 좋다. 프로그래밍 언어에서 goto를 남발하는 것과 비슷한 맥락으로 스파게티 코드가 될 가능성이 높다.


##### 인라인 스타일

코드 분리 및 재사용성을 위해 최대한 피하는 것이 좋다.
