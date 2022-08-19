# @topsort/elements

> Topsort's JS elements and widgets library.

## Table of Contents

1. [Installation](#installation)
1. [Integration](#integration)
1. [Development](#development)
   1. [TODOs](#todos)

## Installation

TODO script with cdn link

## Integration

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

## Development

1. Install dependencies:

   ```zsh
   npm install
   ```

1. Start development server to run the demo on http://localhost:8080/:

   ```zsh
   npm run start
   ```

### TODOs

- write documentation for methods and props
- sanitize custom text
- i18n
- extract types to @types
- extract defaults/css classes to @defaults or @constants or something
- finalize all public classNames before shipping so we can minimize the number of changes we make to them
- expose method to just re-attach buttons incase of virtualized lists
- publish to s3 instead of unpkg so that marketplaces don't have to whitelist unpkg

call an endpoint in CC with apiKey and vendorId, which would auth them
