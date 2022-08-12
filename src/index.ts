// import * as ProductCampaign from "./product-campaign";
import { ApiKey } from "@types";

const projectName = "Topsort Elements";

let apiKey: ApiKey;

type InitParams = {
  apiKey: ApiKey;
};

export function init(params: InitParams) {
  if (typeof params !== "object") {
    console.warn("[Topsort Elements] The required init params are missing.");
  }
  apiKey = params.apiKey;
  return `Hello, welcome to ${projectName}!`;
}

function createAndAppendStyleSheet(content: string) {
  const style = document.createElement("style");
  style.textContent = content;
  document.head.appendChild(style);
}

type CustomClassName = {
  className: string;
  replace?: boolean;
};

type Style = {
  button: CustomClassName;
  buttonText: CustomClassName;
};

const buttonClassName = "topsort-product-promote-button";
const defaultButtonStyles = [
  "cursor: pointer;",
  "border-radius: 0.25rem;",
  "background-color: #DDD6FF;",
  "position: absolute;",
  "bottom: 0.5rem;",
  "right: 0.5rem;",
];
const buttonTextClassName = "topsort-product-promote-button-text";
const defaultButtonTextStyles = ["color: #00042A;", "font-weight: 600;"];

function formatStyleContent(className: string, styles: string[]) {
  return `.${className} {\n  ${styles.join("\n  ")}\n}\n`;
}

function createButtonStyleSheet(style?: Style) {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = "";
  if (!style?.button.replace) {
    styleSheet.textContent += formatStyleContent(
      buttonClassName,
      defaultButtonStyles
    );
  }
  if (!style?.buttonText.replace) {
    styleSheet.textContent += formatStyleContent(
      buttonTextClassName,
      defaultButtonTextStyles
    );
  }
  if (styleSheet.textContent !== "") {
    /*
     * NOTE(christopherbot)
     * To support consumers extending our default styles, this style sheet is
     * prepended instead of appended so it comes before other style sheets so
     * other style sheets take higher priority.
     */
    document.head.prepend(styleSheet);
  }
}

function createButton({
  productId,
  text,
  style,
}: {
  productId: string;
  text: string;
  style?: Style;
}) {
  const button = document.createElement("button");

  if (style?.button) {
    button.classList.add(style.button.className);
  }
  if (!style?.button.replace) {
    button.classList.add(buttonClassName);
  }

  const buttonText = document.createElement("span");
  buttonText.innerText = text;
  if (style?.buttonText) {
    buttonText.classList.add(style.buttonText.className);
  }
  if (!style?.buttonText.replace) {
    buttonText.classList.add(buttonTextClassName);
  }

  button.appendChild(buttonText);

  button.addEventListener("click", () => {
    console.log(
      `[Topsort Elements] Promote button clicked for product "${productId}"`
    );
  });

  return button;
}

type RenderButtons = {
  targetClass?: string;
  style?: Style;
  buttonText?: string;
};

export function renderButtons({
  targetClass,
  style,
  buttonText,
}: RenderButtons = {}) {
  if (!apiKey) {
    console.warn(
      '[Topsort Elements] Cannot call "renderButtons" before calling "init" with the apiKey.'
    );
    return;
  }

  createButtonStyleSheet(style);

  const targets = [
    ...document.getElementsByClassName(targetClass || "topsort-target-product"),
  ];
  targets.forEach((target) => {
    if (!(target instanceof HTMLElement)) return;

    const productId = target.dataset.topsortProductId;

    if (!productId) return;

    const button = createButton({
      productId,
      text: buttonText || "Promote",
      style,
    });
    target.appendChild(button);
  });
}
