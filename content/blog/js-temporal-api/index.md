---
title: JavaScript에서 날짜, 시간과 Temporal API
date: "2021-12-26"
tags: [JavaScript]
description: JavaScript의 Date API를 대체할 Temporal API에 대해 알아봅니다.
---

# JavaScript와 시간, 날짜 그리고 `Date`

JavaScript에서 시간과 날짜에 대한 정보를 다룰 때 기본적으로 `Date` 객체를 사용합니다. 하지만 `Date` 객체를 쓰고 싶어 하는 사람은 별로 없습니다. 왜냐하면, 뭔가 이상하고 사용하기 어렵거든요.

예를 들면 아래와 같은 문제점이 있습니다.
- 월은 0부터 시작합니다. (1월이 0이고, 12월이 11로 표기됩니다)
- 하지만 일은 1부터 시작합니다.
- UTC와 사용자 환경의 시간대만을 지원합니다.
- 그레고리력만 지원합니다.
- 일광 절약 시간(흔히 서머타임이라 부릅니다)을 지원하지 않습니다.
- 사용하기 불편한 API를 가지고 있습니다.

```javascript
const today = new Date();
const tomorrow = new Date();
// 현재 시간에서 하루 뒤의 시간을 구합니다.
tomorrow.setDate(today.getDate() + 1);

// 현재 시간에서 90분 뒤의 시간을 구합니다.
tomorrow.setHours(today.getHours(), today.getMinutes() + 90);
// 혹은 이렇게도 할 수 있습니다.
tomorrow.setHours(today.getHours() + 1, today.getMinutes() + 30);
```


위의 코드를 보면 단순한 연산이지만, 사용하기에는 썩 좋지 않습니다. 그래서 보통 서드파티 시간/날짜 라이브러리를 많이 사용합니다. 예전에는 [moment.js](https://momentjs.com/)를 많이 사용했었고 최근에는 [date-fns](https://date-fns.org/)나 [Day.js](https://day.js.org/) 사용하죠.

## `Date`의 역사 

JavaScript는 Date API를 왜 이렇게 불편하게 설계했을까요? 그 원인은 바로 예전 Java의 탓이 큽니다.

갑자기 JavaScript 얘기하다 말고 Java가 무슨 소리냐고요? 보통 JavaScript와 Java를 `돌과 돌고래` 같은 비유로 둘은 아무 관련이 없다고 많은 분들이 말씀하지만, 사실 JavaScript는 Java에서 많은 영향을 받았습니다. 그래서 이름도 **Java**Script인 것이고요. Date API 역시 Java의 영향을 굉장히 많이 받았는데 사실 영향을 많이 받은 정도가 아니고 Java의 `java.util.Date` 패키지의 쌍둥이 수준으로 비슷하게 구현되었습니다. 실제로 예전 Java의 [java.util.Date 패키지 문서](https://docs.oracle.com/javase/7/docs/api/java/util/Date.html)를 보면 JavaScript의 `Date`와 아주 유사한 것을 확인할 수 있습니다.

시간이 흐르고 Java는 Java 8을 기점으로 현대적인 시간/날짜 관리 패키지인 `java.time`을 추가하면서 `java.util.Date`와 멀어졌습니다. 그리고 오랜 시간 동안 JavaScript는 아직까지 `Date`를 사용하고 있습니다. 저희는 언제까지 불편하고 오래된 API를 가진 `Date`를 써야 하는 것일까요?

# Temporal API

사실 JavaScript도 현대적인 시간/날짜 API를 준비하고 있습니다. 바로 [Temporal API](https://tc39.es/proposal-temporal/)입니다. 아직은 표준에 포함되지 않았지만 Stage 3 Proposal로 곧 표준에 포함될 것으로 예상됩니다. 하지만 아직 표준이 정립되지 않은 만큼 이 글에서 소개하는 내용도 추후에 충분히 바뀔 수 있다는 것을 먼저 말씀드립니다.

Temporal API는 정말 많은 개선이 있는데요, 위에 적어놓았던 문제들이 해결되었습니다.

- 사용하기 편리한 날짜, 시간 연산을 지원합니다.
- 모든 시간대를 지원하며, 일광 절약 시간도 지원합니다.
- 시간, 날짜 문자열 파싱이 좋아졌습니다.
- 그레고리력이 아닌 달력도 지원합니다.


## 현재 날짜와 시간 가져오기

현재 시간과 날짜에 대한 정보는 `Temporal.Now` 객체를 사용하여 알 수 있습니다.

```javascript
// 현재 시간대를 가져옵니다.
Temporal.Now.timeZone(); // Temporal.TimeZone 객체를 반환합니다.

Temporal.Now.timeZone().id; // "Asia/Seoul"

// 현재 시간대의 
Temporal.Now.zonedDateTimeISO();

// 아이슬란드의 수도, 레이캬비크의 현재 시간을 가져옵니다.
Temporal.Now.zonedDateTimeISO('Atlantic/Reykjavik')

// 프랑스 파리의 현재 시간을 가져옵니다.
Temporal.Now.zonedDateTimeISO('Europe/Paris')
```

## Unix Timestamp 가져오기

Instant 클래스를 사용하여 주어진 시간의 타임스탬프를 가져올 수 있고, `epochNanoseconds` 필드를 통해 나노초 단위의 정확한 시간을 가져올 수 있습니다.

```javascript
// 현재 시간에 대한 Unix timestamp를 가져옵니다.
Temporal.Now.instant().epochSeconds;
Temporal.Now.instant().epochMilliseconds;

// 나노초 단위의 Unix timestamp를 가져옵니다. 값의 타입은 BigInt입니다.
Temporal.Now.instant().epochNanoseconds;

// 임의의 시간에 대한 Unix timestamp도 가져올 수 있습니다.
Temporal.Instant.from('2021-12-27T01:44+09:00').epochNanoseconds;
Temporal.Instant.from('2021-12-27T01:44+09:00[Asia/Seoul]').epochNanoseconds;
```

## 일반적인 시간 표현하기

시간대 정보가 포함되지 않은 날짜나 시간 정보는 `PlainTime`, `PlainDate`, `PlainDateTime` 클래스를 통해 표현할 수 있습니다. 예를 들면 "오후 3시", "2022년 1월 31일" 같이 문장 그대로의 의미만 가지며 시간대 정보를 포함하지 않는 날짜와 시간을 표현하는 데 사용합니다.

```javascript
// 11시 22분 33초를 표현
new Temporal.PlainTime(11, 22, 33);
Temporal.PlainTime.from('11:22:33');

// 1996년 2월 21일을 표현
new Temporal.PlainDate(1996, 2, 21);
Temporal.PlainDate.from('1996-2-21');

// 1996년 2월 21일 오후 3시 30분 50초를 표현
new Temporal.PlainDateTime(1996, 2, 21, 15, 30, 50);
Temporal.PlainDateTime.from('1996-02-21T15:30:50');
```

단순히 연-월이나 월-일을 표현하는데 사용하는 `PlainYearMonth`와 `PlainMonthDay`도 있습니다.

```javascript
new Temporal.PlainYearMonth(1996, 2);
Temporal.PlainYearMonth.from('1996-02');

new Temporal.PlainMonthDay(2, 21);
Temporal.PlainMonthDay.from('02-21');
```

## Temporal 객체에서 시간/날짜 값 가져오기

```javascript
const t = Temporal.ZonedDateTime.from({
  timeZone: 'Asia/Seoul',
  year: 2021,
  month: 12,
  day: 27,
  hour: 2,
  minute: 7,
  second: 0,
  millisecond: 0,
  microsecond: 0,
  nanosecond: 0
});

t.year;   // 2021
t.month;  // 12
t.day;    // 27
t.hour;   // 2
t.minute; // 7
t.second; // 0
t.inLeapYear; // false (윤년 여부를 나타냅니다)
t.daysInYear; // 365 (윤년이면 366이 됩니다)
```

당연히 객체 분해 할당을 이용하여 값을 가져오는 것도 가능합니다.

```javascript
const { year, month, day, hour, ...rest} = Temporal.ZonedDateTime.from({
  timeZone: 'Asia/Seoul',
  year: 2021,
  month: 12,
  day: 27,
  hour: 2,
  minute: 7,
  second: 0,
  millisecond: 0,
  microsecond: 0,
  nanosecond: 0
});
```

## 날짜/시간 연산

`Date`와 다르게 `Temporal` 객체는 불변입니다. 이를 이용해 기존 객체에 영향을 주지 않고 연산을 할 수 있습니다.

```javascript
// Temporal.ZonedDateTime <2021-12-27T02:10:44.422640043+09:00[Asia/Seoul]>
// 현재 시간은 오전 2021년 12월 27일 오전 2시 10분 44초입니다.
const t = Temporal.Now.zonedDateTimeISO();

// 2시간 10분을 더해 오전 4시 20분 44초가 되었습니다.
// Temporal.ZonedDateTime <2021-12-27T04:20:44.422640043+09:00[Asia/Seoul]>
t.add({ hours: 2, minutes: 10 });

// t.add 함수를 통해 시간을 더 했지만 원본 객체는 바뀌지 않았습니다!
// Temporal.ZonedDateTime <2021-12-27T02:10:44.422640043+09:00[Asia/Seoul]>
t;
```

위의 예제처럼 시간, 분 외에도 년, 주 월 단위의 연산이 가능합니다.

```javascript
const t = Temporal.Now.zonedDateTimeISO();

// 1년하고도 2주 전의 날짜를 가져옵니다.
t.subtract({ years: 1, weeks: 2 });

// 3달하고도 5시간 뒤의 날짜를 가져옵니다.
t.add({ months: 3, hours: 5 });
```


# 마치며

글을 작성하며 잠깐 사용해 본 느낌으로는 `Date`에서 불편했던 거의 모든 부분이 개선되어서 `date-fns`나 `Day.js` 같은 외부 라이브러리를 사용할 필요를 못 느낄 만큼 좋았습니다.

하지만 아직 표준이 아니라 지속적으로 API에 변화가 있을테니, 이 글은 정보 전달용으로 읽어주시고 가능하면 공식 문서를 참고하시는 것을 추천드립니다.

미리 Temporal API를 사용해 보고 싶으시다면 [Temporal API 문서](https://tc39.es/proposal-temporal/docs/) 페이지에서 개발자 도구 콘솔을 열어 테스트해보시거나, [Polyfill](https://github.com/js-temporal/temporal-polyfill)을 사용해 보시면 좋을 것 같습니다.
