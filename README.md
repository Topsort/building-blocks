# elements

Topsort's JS elements and widgets library.

Table of Contents

1. Installation
1. Usage
1. Development
1. demo

Installation

TODO script with cdn link

Usage

HTML

```html
<div
  class="my-custom-class topsort-promote-target"
  data-topsort-product-id="[product-id-here]"
>
  ...
</div>
```

JS

TopsortElements.init

TopsortElements.initProductPromotion()

- for class names, do not start them with a period ("."), e.g.:

Correct:

```js
{
  promoteTargetClassName: "my-custom-class",
}
```

Incorrect: ".my-custom-class"

```js
{
  promoteTargetClassName: ".my-custom-class",
}
```

Development [#development]

Install http-server globally:

```zsh
npm install --global http-server
```

Demo [#demo]

To launch the demo, run:

```zsh
npm run demo
```

TODOs

- Use webpack-dev-server instead of http-server for hot reloading
- write documentation for methods and props
- fix build so that the cache doesn't need to be emptied before seeing changes after restarting http-server
- sanitize custom text
- i18n
- extract types to @types
- extract defaults/css classes to @defaults or @constants or something
- finalize all public classNames before shipping so we can minimize the number of changes we make to them
