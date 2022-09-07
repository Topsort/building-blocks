# @topsort/elements

> Topsort's JS elements and widgets library.

## Table of Contents

1. [Installation](#installation)
1. [Integration](#integration)
   1. [Product Promotion](#product-promotion)
1. [Development](#development)
   1. [TODOs](#todos)

## Integration

1. _TODO script with cdn link_

1. After the script is loaded, initialize the `TopsortElements` library:

   ```js
   const tsElements = new TopsortElements({
     apiKey: "api-key-123",
     externalVendorId: "vendor-id-123",
   });
   ```

### Product Promotion

1. Initialize product promotion:

   With defaults:

   ```js
   tsElements.initProductPromotion();
   ```

   With custom props:

   ```js
   tsElements.initProductPromotion(
    promoteTargetClassName: "my-custom-promote-target",
      style: {
        button: {
          // defaults to "sm"
          borderRadius: "none" | "sm" | "full"
        },
      },
      text: {
        promoteButton: "Create Campaign",
        detailButton: "View Campaign",
      },
   );
   ```

1. In your markup, add the following HTML class and data attributes to the element(s) you want a Promote button appended to:

   ```html
   <div
     class="ts-promote-target some-other-custom-class"
     data-ts-product-id="product-id-123"
   >
     ...
   </div>
   ```

   This target class is also a static property of the TopsortElements class:

   ```jsx
   <div
     class={`${TopsortElements.promoteTargetClassName} my-custom-class`}
     data-ts-product-id="product-id-123"
   >
     ...
   </div>
   ```

   If you are using a custom promote target class name, use it instead:

   ```html
   <div
     class="my-custom-promote-target my-custom-class"
     data-ts-product-id="product-id-123"
   >
     ...
   </div>
   ```

1. You can set a primary and secondary theme color.

   With CSS:

   ```css
   :root {
     --ts-primary-rgb: 18, 58, 188;
     --ts-secondary-rgb: 222, 222, 222;
   }
   ```

   With JavaScript:

   ```js
   document.documentElement.style.setProperty(
     "--ts-primary-rgb",
     "18, 58, 188"
   );
   document.documentElement.style.setProperty(
     "--ts-secondary-rgb",
     "222, 222, 222"
   );
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
  - We can use the JS I18n API
  - We can detect the browser's locale (https://stackoverflow.com/a/31135571/9717640) but it might be better to allow the marketplace to pass in their preferred locale to the `new TopsortElements()` call so each marketplace user has a consistent experience. Not sure if that would be better because then if one user has a different preferred locale that their browser is set to, it won't be used.
- finalize consumer-facing prop names
  - prefix is currently `ts`, should it be `tse` (which stands for "topsort elements")?
- expose method to just re-attach buttons incase of virtualized lists
  - or use a MutationObserver and do it ourselves:
    https://stackoverflow.com/questions/69781031/inserting-dom-elements-using-content-script-in-chrome-extension
- publish to s3 instead of unpkg so that marketplaces don't have to whitelist unpkg
- use typescript for demo/loader.js
- consider not storing apiToken on TopsortElements instance
- consider accepting `primaryRgb` and `secondaryRgb` as props and set the css vars on our side. Or maybe multiple ways of setting it (consumer in css, consumer in JS, us in JS using props)
- figure out how to use Fragment shorthand (<></>)
- fix tooltip height with long text
