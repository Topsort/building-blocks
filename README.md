# elements

Topsort's JS elements and widgets library.

Table of Contents

1. Installation
1. Usage
1. setup
1. demo

Installation

TODO script with cdn link

Usage

HTML

```html
<div
  class="my-custom-class topsort-target-product"
  data-topsort-product-id="[product-id-here]"
>
  ...
</div>
```

JS

TopsortElements.init

TopsortElements.renderButtons

Setep [#setup]

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
