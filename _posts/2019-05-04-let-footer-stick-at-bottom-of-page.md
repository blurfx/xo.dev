---
title: Footer 항상 바닥에 고정시키기
tags: [Web, CSS]
layout: post
comments: true
---

```html
<!-- ... -->
<body>
    <div class="wrapper">
        <footer>
            footer
        </footer>
    </div>
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

