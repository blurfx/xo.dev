---
title: Storybook과 Emotion 11 충돌 오류 해결하기
tags: [Storybook, Emotion, webpack]
layout: post
comments: true
---

Emotion 11을 사용해서 컴포넌트 라이브러리를 개발하며 Storybook으로 문서화 및 테스트를 도입하려고 했는데, Storybook을 빌드하니 아래와 같은 오류가 발생했다.

```
ERROR in ./src/components/Button/styles.ts
Module not found: Error: Can't resolve '@emotion/styled/base' in '/Users/xo/ui/src/components/Button'
```

분명히 `@emotion/styled` 패키지가 잘 설치되어 있는데, 위와 같은 오류가 나길래 오류로 검색하니 같은 오류에 관한 Issue가 있었고 댓글에서 [해결 방법](https://github.com/storybookjs/storybook/issues/13277#issuecomment-751733550)을 찾을 수 있었다.

이 방법을 따라 `.storybook/main.js`를 아래와 같이 변경하니 이제 빌드가 정상적으로 잘 된다.
```js
const path = require("path")

const resolvePath = (_path) => path.join(process.cwd(), _path)

module.exports = {
  // ...
  "webpackFinal": async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@emotion/styled": resolvePath("node_modules/@emotion/styled"),
      }
    }
  })
}
```

그런데 `@storybook/addon-docs`를 사용하여 렌더링하는 문서 페이지에만 접근하면 아래와 같은 오류가 발생하며 이후 스토리에서 컴포넌트 렌더링도 되지 않는 문제를 발견했다.

개발자 도구를 열어 확인해보니 아래와 같은 오류가 발생했다는 것을 알수 있었다.

```
DocsPage.js:70 Uncaught TypeError: Cannot read property 'content' of undefined
    at DocsPage.js:70
    at handleInterpolation (emotion-serialize.browser.esm.js:137)
    at serializeStyles (emotion-serialize.browser.esm.js:251)
    at emotion-styled-base.browser.esm.js:110
    at Styled(div) (emotion-element-4fbd89c5.browser.esm.js:27)
    at renderWithHooks (react-dom.development.js:14985)
    at updateForwardRef (react-dom.development.js:17044)
    at beginWork (react-dom.development.js:19098)
    at HTMLUnknownElement.callCallback (react-dom.development.js:3945)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994)
```

`DocsPage.js`의 오류가 발생한 부분에 중단점을 걸고 값을 확인해보니 Docs 애드온에서 `@emotion/styled`를 사용한다는 것과 오류가 발생한 부분의 styled 객체에서 인자로 받는 `theme`이 빈 객체 리터럴로 넘어온 것을 확인할 수 있었다.

그래서 `@storybook/addon-docs`의 `package.json`을 확인해보니 [Emotion 10을 사용](https://github.com/storybookjs/storybook/blob/0566481a66eb724e2496347ea3acf9171271cf86/addons/docs/package.json#L85)한다는 것을 알 수 있었고, Storybook 레포지터리에서 Emotion 11과 관련된 이슈들을 확인해보다가 [한 이슈의 댓글](https://github.com/storybookjs/storybook/issues/13145#issuecomment-729253408)에서 문제를 해결할 힌트를 얻었다.

Emotion 11로 넘어오며 `@emotion/core` 대신 `@emotion/react`를 사용하고, `emotion-theming`은 `@emotion/react`에 통합되어 Emotion 10 기준에서 패키지를 리졸빙하는데 문제가 있을 것으로 추측하여 아래와 같이 `.storybook/main.js` 를 수정하니 문제없이 정상적으로 동작하기 시작했다!

```js
const path = require("path")

const resolvePath = (_path) => path.join(process.cwd(), _path)

module.exports = {
  // ...
  "webpackFinal": async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@emotion/core": resolvePath("node_modules/@emotion/react"),
        "@emotion/styled": resolvePath("node_modules/@emotion/styled"),
        "emotion-theming": resolvePath("node_modules/@emotion/react"),
      }
    }
  })
}
```
### FYI

- Storybook 빌드 시 사용할 webpack 설정을 변경하고 싶다면 `.storybook/main.js` 파일의 `webpackFinal` 필드를 통해 변경할 수 있다. \[[ref](https://storybook.js.org/docs/react/configure/webpack)]
- webpack의 `resolve.alias`로 모듈에 대한 alias를 만들 수 있다. \[[ref](https://webpack.js.org/configuration/resolve/#resolvealias)]
