---
title: TypeScript의 unknown, any 그리고 never
tags: [TypeScript]
layout: post
comments: true
---

TypeScript는 JavaScript에 없는 새로운 타입들이 있는데 최근에 TypeScript로 개발을 하며 `unknown`, `any` 그리고 `never` 세 가지 타입의 차이점을 제대로 이해하고 있지 않고 있다는 생각이 들어 따로 정리를 해보았습니다.

# Unknown

`unknown`은 TypeScript의 탑 타입(Top Type)입니다. TypeScript에 존재하고, 존재 할 수 있는 모든 타입들을 포함하여 어떤 값이든 가질 수 있지만 그로 인해 모든 타입이 공통적으로 할 수 있는 연산 외에는 할 수 있는 것이 아무것도 없습니다. 그래서 이름 그대로 값이 어떤 타입인지 알 수 없는(unknown) 타입이기 때문에 `unknown` 타입 변수는 사용할때 어떤 타입인지 다시 한 번 명시를 해주어야합니다.

```typescript
let myVar: unknown = 'hello';

// 이 변수의 타입은 unknown이므로 어떤 타입의 값이든 할당과 재할당이 가능
myVar = 42;

// **오류** myVar 변수의 타입이 명확하지 않으므로 number 타입 변수에 값 할당이 불가능
let age: number = myVar;

// unknown 타입 변수는 이렇게 사용할 때 타입을 명시해주어야 함
let age: number = (myVar as number);
```

`unknown` 타입 변수에 대해 타입 검사가 된 후에는 타입을 명시해주지 않아도 됩니다.
```typescript
const flag: unknown = true;

if (flag === true) {
    // if 조건문에서 엄격한 비교를 통해 boolean 값인지 확인했으므로
    // 새 boolean 변수에 대입을 할 때에는 타입을 명시하지 않아도 됨
    const something: boolean = flag;
    
    // ...
}

if (typeof maybe === 'string') {
  // typeof 연산자를 사용하여 타입을 확인한 뒤에도 타입을 명시하지 않아도 됨
  const text: string = maybe;
}
```

# Any

타입 검사를 *항상* 만족하여 어떤 값이든 바로 대입하고 사용할 수 있는, TypeScript에서 가장 유용하지만 가장 주의해서 사용해야 하는 마법과 같은 타입입니다. JavaScript로 작성된 모듈을 최소한의 수정으로 사용하거나, 혹은 기존의 JavaScript 코드를 TypeScript로 재작성 하는 작업을 할 때 이 `any`라는 마법같은 타입을 사용하면 별다른 작업 없이 코드가 동작하지만, 반대로 타입 검사를 항상 만족하므로 의도치 않은 형 변환이나 전혀 예상하지 못한 의도되지 않은 타입의 값이 대입되는 등 여러 사이드 이펙트를 일으켜 안전성이 낮아지기 때문에 조심해야합니다.

```typescript
let value: any = 42;

// 지금 value에는 number타입의 값이 할당되어 있고
// number 타입은 runTask()라는 메소드를 가지고 있지 않지만
// any 타입이므로 컴파일러가 별도로 확인을 하지 않아 문제가 없다고 판단함
value.runTask();


// number 타입은 toFixed() 메소드를 가지고 있으므로 문제가 없음
// 하지만 역시 컴파일러가 메소드의 존재 여부를 별도로 확인을 하지는 않음
value.toFixed();
```

객체에 존재하지 않는 프로퍼티에 접근을 해도 컴파일러가 검사를 하지 않기 때문에 아래와 같은 코드도 typescript는 문제가 없다고 판단합니다. 물론 런타임에는 문제가 됩니다.

```typescript
const user: any = {};

user.notifications.latest.messge;
```

# Never

앞서 말한 `unknown` 타입은 모든 타입을 포함하는 슈퍼셋 타입이라고 설명했습니다. 반대로 `never`는 모든 타입의 하위 타입입니다. 그래서 어떤 다른 값도 `never` 타입에 할당할 수 없습니다.

```typescript
// never 변수에는 어떤 값도 할당할 수 없습니다.
// 그래서 아래의 두 코드는 TypeScript에서 컴파일 오류가 발생합니다.
const first: never = 42;
const second: never = 'some text';
```

그렇다면, `never`는 언제 사용할까요? 많은 사용 방법이 있겠지만 여기서는 일반적으로는 함수가 어떠한 값도 반환하지 않을 때와 타입 추론 예외를 제거하는 방법을 소개합니다.

먼저, 아래와 같이 어떠한 값도 반환하지 않는 함수라면 반환 타입을 `never`로 명시하여 어떠한 값도 반환하지 않음을 알려줄 수 있습니다.
```typescript
const fetchFriendsOfUser = (username: string): never => {
  throw new Error('Not Implemented');
}
```

`never`를 사용하면 그리고 타입 추론에서 예외 타입들을 걸러내는 역할도 합니다. 예를 들어 아래의 NonString 타입은 어떤 타입이든 될 수 있지만 `string` 타입인 경우는 `never`로 추론하여 `string` 타입의 값이 할당되지 못하도록 할 수 있습니다.
```typescript
type NonString<T> = T extends string ? never : T;
```
