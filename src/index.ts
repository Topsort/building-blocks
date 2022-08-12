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

type CustomClassName = {
  className: string;
  replace?: boolean;
};

type Style = Partial<
  Record<"button" | "buttonText" | "modal", CustomClassName>
>;

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
  if (!style?.button?.replace) {
    styleSheet.textContent += formatStyleContent(
      buttonClassName,
      defaultButtonStyles
    );
  }
  if (!style?.buttonText?.replace) {
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
  style,
  text,
}: {
  productId: string;
  style?: Style;
  text: string;
}) {
  const button = document.createElement("button");

  if (style?.button) {
    button.classList.add(style.button.className);
  }
  if (!style?.button?.replace) {
    button.classList.add(buttonClassName);
  }

  const buttonText = document.createElement("span");
  buttonText.innerText = text;
  if (style?.buttonText) {
    buttonText.classList.add(style.buttonText.className);
  }
  if (!style?.buttonText?.replace) {
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

type InitProductPromotion = {
  buttonText?: string;
  style?: Style;
  targetClass?: string;
};

export function initProductPromotion({
  buttonText,
  style,
  targetClass,
}: InitProductPromotion = {}) {
  if (!apiKey) {
    console.warn(
      '[Topsort Elements] Cannot call "initProductPromotion" before calling "init" with the apiKey.'
    );
    return;
  }

  // TODO(christopherbot) validate API key

  createButtonStyleSheet(style);

  const targets = [
    ...document.getElementsByClassName(targetClass || "topsort-promote-target"),
  ];
  targets.forEach((target) => {
    if (!(target instanceof HTMLElement)) return;

    const productId = target.dataset.topsortProductId;

    if (!productId) {
      console.warn(
        "[Topsort Elements] Skipping button on element with no data-topsort-product-id."
      );
      return;
    }

    const button = createButton({
      productId,
      style,
      text: buttonText || "Promote",
    });
    target.appendChild(button);
  });
}
