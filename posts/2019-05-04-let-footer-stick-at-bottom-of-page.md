---
title: Footer 항상 바닥에 고정시키기
tags: [Web, CSS]
layout: post
comments: true
---

아래와 같은 구조일때 flex를 사용하면 매우 쉽게 footer를 바닥에 고정시킬 수 있다.

```html
<!-- ... -->
<body>
    <div class="wrapper">
        <header>
            header
        </header>
        <main>
            main
        </main>
        <footer>
            footer
        </footer>
    </div>
</body>
<!-- ... -->
```
```css
body {
    display: flex;
    flex-direction: column;
}

.wrapper {
    flex: 1 0 auto;
}

footer {
    flex-shrink: 0;
}
```

