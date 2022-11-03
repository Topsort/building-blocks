# @topsort/building-blocks

> Topsort's JS library for building individual and easily integratable widgets.

## Table of Contents

1. [Integration](#integration)
   1. [Product Promotion Modal](#product-promotion-modal)
1. [Development](#development)
   1. [Running the demo](#running-the-demo)
   1. [Adding new environment variables](#adding-new-environment-variables)

## Integration

1. Insert a script in your site's `<head>` tag to load the Topsort Building Blocks library. Ensure the script has `defer` to load it without affecting your site load times. Replace `x.y.z` with the desired version, or use `@latest` to use the latest version of the library at all times.

   ```html
   <head>
     <!-- The rest -->
     <script
       defer
       src="https://unpkg.com/@topsort/building-blocks@x.y.z/dist/index.js"
     ></script>
   </head>
   ```

1. After the DOM is loaded, create an instance of the `TopsortBlocks` library. For example:

   ```js
   document.addEventListener("DOMContentLoaded", async () => {
     const tsBlocks = new TopsortBlocks();
   });
   ```

1. Initialize it:

   With defaults:

   ```js
   await tsBlocks.init({
     authToken: "auth-token-123",
     externalVendorId: "vendor-id-123",
   });
   ```

   With custom props:

   ```js
   await tsBlocks.init({
     authToken: "api-key-123",
     externalVendorId: "vendor-id-123",
     // if you want to use a custom target class:
     promoteTargetClassName: "my-custom-promote-target",
     style: {
       // color RGBs acceptable in either format:
       primaryColorRgb: "50, 175, 200",
       secondaryColorRgb: "50, 175, 200",
       fontColorRgb: [50, 175, 200],

       button: {
         // defaults to "sm":
         borderRadius: "none" | "sm" | "full"
       },
     },
     text: {
       // defaults to "Promote":
       promoteButton: "Create Campaign",
       // defaults to "See Campaign":
       detailButton: "View Campaign",
     },
   });
   ```

### Product Promotion Button and Modal

1. In your markup, add the following HTML class and data attributes to the element(s) you want a Promote button appended to:

   ```html
   <div
     class="ts-promote-target some-other-custom-class"
     data-ts-product-id="product-id-123"
     data-ts-product-name="My Product"
     data-ts-product-img-url="https://picsum.photos/100"
   >
     ...
   </div>
   ```

   This target class is also a static property of the TopsortBlocks class:

   ```jsx
   <div
     class={`${TopsortBlocks.promoteTargetClassName} my-custom-class`}
     data-ts-product-id="product-id-123"
     data-ts-product-name="My Product"
     data-ts-product-img-url="https://picsum.photos/100"
   >
     ...
   </div>
   ```

   If you are using a custom promote target class name, use it instead:

   ```html
   <div
     class="my-custom-promote-target my-custom-class"
     data-ts-product-id="product-id-123"
     data-ts-product-name="My Product"
     data-ts-product-img-url="https://picsum.photos/100"
   >
     ...
   </div>
   ```

1. Call `useProductPromotion` to have the Promote buttons rendered, and each time you want to have the Promote buttons rerendered such as after navigating to a new page of products or filtering the product list:

   ```js
   tsBlocks.useProductPromotion();
   ```
## Development

### Running the demo

1. Install the dependencies:

   ```bash
   npm install
   ```

1. Create and set up your `.env` file:

   ```bash
   cp .env.example .env
   ```

1. Start the development server which runs the demo at [localhost:8080](http://localhost:8080):

   ```bash
   npm run start
   ```

### Adding new environment variables

Environment variables should not contain secrets (e.g. private API keys) since they will be injected into the published build. They are meant to change the behaviour between different environments such as calling a local, staging, or production Central Services API base URL.

To add a new env var:

1. Add its name to `.env.example` with an empty or default value:

   ```bash
   MY_NEW_PUBLIC_VAR=
   ```

1. Add its name and value to your `.env`:

   ```bash
   MY_NEW_PUBLIC_VAR="the actual value"
   ```

1. To have it injected into the app, add it to `webpack.common.js` in the `DefinePlugin`:

   > Remember to wrap the value in `JSON.stringify()` because the `DefinePlugin` does a find-and-replace and the value given to it must include actual quotes inside of the string itself.
   >
   > For reference, see the Tip on the [Webpack DefinePlugin docs](https://webpack.js.org/plugins/define-plugin/).

   ```js
   new webpack.DefinePlugin({
    // ...the rest
    MY_NEW_PUBLIC_VAR: JSON.stringify(process.env.MY_NEW_PUBLIC_VAR),
   }),
   ```

1. To inform TypeScript of this new global variable, add it to `src/types.ts` under the global declaration with its type:

   ```ts
   declare global {
     // ...the rest
     const MY_NEW_PUBLIC_VAR: string;
   }
   ```

1. To inform eslint of this new global variable, add it to `.eslintrc.js` under `globals` with a `readonly` value (assuming it's meant to be readonly):

   ```js
   globals: {
    // ...the rest
    MY_NEW_PUBLIC_VAR: "readonly",
   },
   ```

1. Ensure you restart your dev server so webpack can pick up the latest changes.
