---
title: PEG로 문법 파싱하기
description: 사용자 정의 문법을 PEG를 사용해 파싱하는 방법에 대해 설명합니다.
date: "2024-09-24"
tags: [Parser]
---

# 문법 파싱 문제

가끔은... 아주 가끔은.. 어떤 문법을 정의하고 파싱해야 하는 문제가 생길 때가 있다. 문법이 아주 간단하면 손수 파서를 작성해도 되지만, 조금 복잡해진다면 파서를 작성하는 것이 더 어려워진다.

얼마전에 잠깐 PoC용으로 TypeScript스러운 타입 선언을 정의하고 파싱을 해볼 수 있는 일이 있었는데, 예전에 yarn에 기여를 하면서 써보았던 PEG를 이번에도 사용했는데, 한국어로 된 PEG 글이 얼마 되지 않아 이번에 했던 PoC를 토대로 간단한 가이드 글을 작성해 본다.

이 글에서 파싱하려고 하는 문법을 먼저 정의해보면 아래와 같다. 

- 원시 타입은 `string`, `number`, `boolean`이다.
- 배열을 지원하며 원시 타입 뒤에 `[]`를 붙여 배열을 나타낸다. 예를 들어 `string[]`은 문자열 배열을 의미한다.
- 타입 선언은 `type` 키워드를 사용하며 `type Indentifier { ... }` 형태로 선언한다. 
  ```graphql
  type User {
    name: string
    age: number
    dead: boolean
  }
  ```

# 문법 파서 만들기

이제 PEG를 통해 위 문법 파서를 만들어보자.
이 글에서는 PEG의 구현체 중 하나인 [Peggy](https://peggyjs.org)를 사용할 것이며 기본적인 문법에 대한 설명을 같이하려고 하지만 공식 문서에 비하면 빈약한 설명이라 [공식 문서](https://peggyjs.org/documentation.html)를 같이 참고하는 것을 추천한다.
또한 Peggy의 [온라인 테스트 페이지](https://peggyjs.org/online.html)를 가이드를 따라 하기 쉬울 것이다.

## PEG 기초 문법

PEG의 기본적인 문법은 굉장히 간단하다.
아래처럼 단순히 어떤 패턴을 정의하고 그 패턴에 원하는 이름(식별자)을 붙여주는 식이다.
이렇게 패턴을 정의하면 문법을 파싱하며 우리가 이름 지은 식별자로 파싱이 된다.

```graphql
식별자 = 패턴
```

또 아래와 같이 사용할 수도 있는데 매치된 패턴 값에 전처리가 필요한 경우에 사용한다. 표현식은 JavaScript로 작성하면 된다.

```graphql
식별자 = 패턴 { 표현식 }
```

예를 들어, 입력(모든 입력은 문자열로 간주된다) 숫자로만 이루어진 패턴을 찾아 숫자 타입으로 변환해 처리하고 싶다면 아래와 같이 선언하면 된다.
아래 Integer 식별자는 [0-9]+ 패턴과 일치하는 문자들을 JavaScript의 parseInt를 사용해 10진수 수로 변환해서 처리하는 코드다.
text()는 패턴 매치된 문자열을 그대로 가져오는 함수다.

```graphql
Integer
  = [0-9]+ { return parseInt(text(), 10); }
```

자바스크립트로 위 선언을 풀어쓴다면 대충 아래와 같다.
```ts
text = "..."
if (/[0-9]+/.test(text)) {
  return parseInt(text, 10);
}
```

이렇게 문법을 정의하고 패턴을 처리하는 방식이 몇 개 더 있지만 이건 글을 진행하며 필요할때 설명한다. 이제 본격적으로 문법의 기본적인 요소들을 먼저 정의해보자.

## 공백 문자

먼저 공백 스페이스와 탭, 그리고 줄바꿈 문자같은 공백 문자로 정의해보자.
Peggy에서는 아래와 같이 문법을 정의할 수 있는데 JavaScript와 비슷하게 공백이나 문자열들을 무시한다.
그래서 아래 예시에 나와있는대로 두 whitespace 문법에 대한 정의는 동일하게 처리된다. 이 상태에서는 우리가 선언한 공백문자 외의 다른 문자가 입력되면 파싱 오류가 발생한다.

```graphql
whitespace
  = [ \t\n\r]

/* 위와 아래는 동일한 식별자 정의다 */

whitespace = [ \t\n\r]
```

## 식별자

그리고 식별자를 정의해보자. 보통의 언어들처럼 영문자 혹은 \_로 시작하고 그 뒤에는 영문자, 숫자, \_가 올 수 있다.
이를 정규표현식으로 나타내면 `[a-zA-Z_][a-zA-Z0-9_]*`이고 PEG로 나타내면 아래와 같다.
그리고 패턴 매칭 후 `{ type: "...", name: "..." }` 형태의 값으로 반환했는데 이는 문법 파싱 후 사용할 수 있는 우리만의 AST를 정의한 것이다.

```graphql
Identifier
  = [a-zA-Z_][a-zA-Z0-9_]* {
      return { type: "Identifier", name: text() };
    }
```
`my_id`를 입력으로 테스트해보면 아래와 같은 결과를 얻을 수 있다.

```js
{
  type: 'Identifier',
  name: 'my_id'
}
```

## 원시 타입

이번에는 원시 타입을 정의해보자. 앞에서 말한대로 이 글에서 정의하려고 하는 타입 선언 문법에서는 `string`, `number`, `boolean` 세 타입밖에 없으므로 아래와 같이 정의할 수 있다.
패턴에서 `/`를 사용한 것을 볼 수 있는데 Peggy 문법에서 `/`는 OR을 의미한다.
앞의 패턴부터 순차적으로 `string` -> `number` -> `boolean`과 일치하는지 확인한다.
참고로 문법은 정의된 순서대로 파싱되는데 `string`, `number`, `boolean` 모두 valid한 identifier이므로 `PrimitiveType`은 `Identifier`보다 먼저 정의되어야한다.

```graphql
PrimitiveType
  = ("string" / "number" / "boolean") {
        return { type: "PrimitiveType", name: text() };
    }
```

## 타입 선언

이제 본격적인 타입 선언 문법을 정의해보자. 앞에서 같은 타입 선언 문법을 정의할 것이라고 했다.
```
type MyTypeName {
  foo: string
  bar: number
  ...
}
```

이를 선언하면 아래와 같은데, 앞에서 사용한 선언 문법과는 조금 다르지만, 앞에서 한 것과 크게 다르지 않다. 그저 매치된 패턴에 대해 이름이 붙여지는 표현이 추가되었을 뿐이다. 

```graphql
TypeDefinition
  = "type" whitespace+ identifier:Identifier whitespace* "{" whitespace* "}" {
      return { type: "TypeDefinition", name: identifier.name }
    }
```

앞에 선언했던 다른 문법 정의와 다른 부분은 다른 문법 정의를 패턴에 다시 사용할 수 있다는 것(`whitespace`, `Identifier`)과 `identifier:Identifier`이런 문법인데,
`identifier:Identifier`는 표현식에 이름을 붙여주는 문법으로 `label:Expression`과 같이 사용할 수 있다.
그러므로 `identifier:Identifier`는 이 패턴에서 `Identifier`라는 타입 정의 표현식을 `identifier`라는 이름을 붙여 관리하겠다는 의미가 된다.

그래서 지금 이 `TypeDefinition`의 패턴을 풀어서 설명해보면 아래와 같다.

- `type`으로 시작해야한다.
- 그 뒤에 `whitespace+` 공백 문자가 최소 1개 이상 있어야 한다.
- 다음에는 `Identifier`가 존재해야한다.
- 그 뒤에는 `{`로 시작해서 `}`로 끝나는데 중괄호 사이에는 공백 문자만 허용한다. 

이제 우리는 아래와 같은 입력을 파싱할 수 있다.
아직은 타입 본문에 공백 문자만 허용하므로 공백 문자외의 다른 문자가 들어가면 오류가 발생한다.
```graphql
type MyType {

}
```

위 입력은 아래와 같은 결과를 출력한다. 타입 선언 문법이 잘 파싱되는 것을 확인할 수 있다.
```js
{
  type: 'TypeDefinition',
  name: 'MyType'
}
```

## 타입 필드

이제 타입 필드를 추가할 차례인데 일단은 하나의 필드만 가질 수 있게 해보자. 아래와 같이 `Identifier: Type` 형태의 값을 파싱할 수 있는 `Field` 패턴을 정의하고 `TypeDefinition`의 중괄호 사이에 `Field` 패턴을 추가하면 된다.

```graphql
TypeDefinition
  = "type" whitespace+ identifier:Identifier whitespace* "{" whitespace* field:Field* whitespace* "}" {
      return { type: "TypeDefinition", name: identifier.name, fields: field }
    }

Field
  = identifier:Identifier whitespace* ":" whitespace* type:PrimitiveType {
      return { name: identifier.name, type: type }
    }
```

이제 아래 입력을 파싱할 수 있게 된다. 
```graphql
type MyType {
  foo: string
}
```

위 입력에 대한 파싱 결과는 아래와 같다.
```js
{
  type: 'TypeDefinition',
  name: 'MyType',
  fields: [
    {
      name: 'foo',
      type: {
        type: 'PrimitiveType',
        name: 'string'
      }
    }
  ]
}
```

이제 여러 필드를 선언할 수 있도록 변경해보자. 아래와 같이 `FieldList` 패턴을 정의하면 되는데, 어려워 보이지만 JavaScript로 작성된 재귀 함수라고 생각하면 이해하기 좀 더 좋을것 같다. `FieldList` 패턴은 재귀적으로 `Field` 패턴을 파싱하며 `Array.concat()` 메소드를 사용해 필드들을 하나의 배열로 합친다.

```graphql
TypeDefinition
  = "type" whitespace+ identifier:Identifier whitespace* "{" whitespace* fields:FieldList* whitespace* "}" {
      return { type: "TypeDefinition", name: identifier.name, fields: fields }
    }

FieldList
  = field:Field whitespace* rest:FieldList? {
      return [field].concat(rest || []);
    }
```

이제 아래와 같은 입력을 파싱할 수 있다.
```graphql
type MyType {
  foo: string
  bar: number
}
```

## 여러개의 타입 정의

이미 실험을 해봤을수도 있겠지만 사실 지금까지 정의한 패턴들로는 1개의 타입밖에 선언하지 못하며 심지어 맨 처음이나 끝에 공백 문자가 있다면 파싱 오류가 발생하고 있다. 이제 이 문제를 해결해보자.

여러 타입을 선언할 수 있게 하는건 앞에서 `FieldList`를 선언했던 것과 똑같은 방법으로 해결할 수 있다. 아래처럼 여러 `TypeDefinition`을 재귀적으로 파싱하는 `TypeDefinitions` 패턴을 정의하면 된다.

```graphql
TypeDefinitions
  = type:TypeDefinition whitespace* rest:TypeDefinitions? {
      return [type].concat(rest || []);
    }
```

그러면 아래와 같이 여러개의 타입을 선언해도 오류 없이 제대로 파싱되는 것을 볼 수 있다.
```graphql
type MyType {
  foo: string
}

type AnotherType {
  bar: number
}
```

맨 끝에 공백문자가 있을 때 오류가 발생하는건 `TypeDefinitions` 패턴으로 해결할 수 있었으나 처음에 공백 문자가 들어가면 아직 오류가 발생한다. 이건 아주 단순한 접근으로 해결할 수 있다. `Start`라는 패턴을 정의하고 앞에 `TypeDefinitions` 앞에 공백 문자가 존재할 수 있도록 하면 된다.

```graphql
Start
  = whitespace* TypeDefinitions
```

이제 기본적인 타입 선언 문법을 파싱할 수 있는 패턴들을 정의지만 아직 배열 타입을 구현하지 않았다. 마지막으로 배열 타입을 구현해보자.

## 배열 타입

먼저 타입 뒤에 `[]`가 있어야 배열 타입이라고 처리할 것이므로 `[]`를 매칭할 수 있는 패턴 `ArraySuffix`을 정의하자. 여기서 `[]`에 대한 매칭의 결과는 항상 `true`가 반환되도록 했는데, 그 이유는 `[]` 자체가 어떤 값을 담고 있는게 아닌 존재만 하면 되므로 `[]`가 매칭되면 `true`를 반환하도록 했다.

그리고 필드에서 배열 타입을 처리할 수 있어야 하므로 아래와 같이 `FieldType`이라는 새로운 패턴을 정의하고 `Field` 패턴을 수정하자.

```graphql
Field
  = identifier:Identifier whitespace* ":" whitespace* type:FieldType {
      return { name: identifier.name, type: type }
    }

FieldType
  = type:PrimitiveType suffixes:ArraySuffix* {
      return applyArraySuffixes(type, suffixes);
    }

ArraySuffix
  = "[]" { return true; }
```

`FieldType` 정의에서 갑자기 `applyArraySuffixes`라는 함수가 등장하는데, PEG에 있는 함수는 아니고 직접 정의한 함수다. PEG 정의 최상단에 아래와 같은 코드를 추가하자.

PEG 최상단에는 `{{ }}`나 `{ }`로 감싼 부분에 자바스크립트 코드를 작성할 수 있는데, `{{ }}`의 경우는 파서가 생성되는 최초 시점에 1번만 실행이 되는 코드이고, `{ }`는 매번 파싱할 때마다 실행되는 코드다. 

`applyArraySuffixes` 함수는 필드의 타입 `baseType`과 타입에 붙은 `[]`의 수 만큼 `true`가 채워진 배열 `suffixes`를 받아서 `suffixes`수 만큼 `baseType`을 배열 타입으로 감싸는 함수다.

```javascript
{{
  function applyArraySuffixes(baseType, suffixes) {
    return suffixes.reduce(function(type, suffix) {
      return {
        type: "ArrayType",
        baseType: type
      };
    }, baseType);
  }
}}
```

예를 들어 `bar: number[][]` 같은 타입은 배열 타입으로 두 번 감싸져 아래와 같은 파싱 결과과 나온다.
```js
{
  name: 'bar',
  type: {
    type: 'ArrayType',
    baseType: {
      type: 'ArrayType',
      baseType: {
        type: 'PrimitiveType',
        name: 'number'
      }
    }
  }
}
```

이제 우리는 PEG로 아래와 같은 타입을 파싱할 수 있는 패턴들을 작성했다.
```graphql
type MyType {
  foo: string
}

type AnotherType {
  bar: number[][]
  baz: boolean
}
```

지금까지 작성한 PEG 패턴은 아래와 같다.

```graphql
{{
  function applyArraySuffixes(baseType, suffixes) {
    return suffixes.reduce(function(type, suffix) {
      return {
        type: "ArrayType",
        baseType: type
      };
    }, baseType);
  }
}}
Start
  = whitespace* TypeDefinitions

TypeDefinitions
  = type:TypeDefinition whitespace* rest:TypeDefinitions? {
      return [type].concat(rest || []);
    }

TypeDefinition
  = "type" whitespace+ identifier:Identifier whitespace* "{" whitespace* fields:FieldList* whitespace* "}" {
      return { type: "TypeDefinition", name: identifier.name, fields: fields }
    }

FieldList
  = field:Field whitespace* rest:FieldList? {
      return [field].concat(rest || []);
    }

Field
  = identifier:Identifier whitespace* ":" whitespace* type:FieldType {
      return { name: identifier.name, type: type }
    }

FieldType
  = type:PrimitiveType suffixes:ArraySuffix* {
      return applyArraySuffixes(type, suffixes);
    }

ArraySuffix
  = "[]" { return true; }

PrimitiveType
  = ("string" / "number" / "boolean") {
        return { type: "PrimitiveType", name: text() };
    }

Identifier
  = [a-zA-Z_][a-zA-Z0-9_]* {
      return { type: "Identifier", name: text() };
    }
    
whitespace
  = [ \t\n\r]
```

# 마치며

지금은 단순한 문법만 지원하지만, 아래와 같은 문제들을 추가로 해결해보면 좋을 것 같다.

- Union 타입
- 선언된 타입을 다시 사용하기
  - 존재하지 않는 타입은 참조할 수 없도록 하기