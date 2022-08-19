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
  class="my-custom-class ts-promote-target"
  data-ts-product-id="[product-id-here]"
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
  - do we allow custom text at all? Or require them to translate? Otherwise it won't be consistent with translations that our app does.
- extract types to @types
- extract defaults/css classes to @defaults or @constants or something
- finalize all public classNames before shipping so we can minimize the number of changes we make to them
- expose method to just re-attach buttons incase of virtualized lists
  - or use a MutationObserver and do it ourselves:
    https://stackoverflow.com/questions/69781031/inserting-dom-elements-using-content-script-in-chrome-extension
- publish to s3 instead of unpkg so that marketplaces don't have to whitelist unpkg
- put common props (text, style etc) into a context
- use typescript for demo/loader.js
