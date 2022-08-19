import { PromoteButton } from "@components/PromoteButton";
import { ApiKey } from "@types";
import { h, render } from "preact";

const defaultText = {
  button: "Promote",
  modalTitle: "Create Campaign",
  modalSubtitle: "Quickly launch a campaign for this product.",
  modalCampaignNamePlaceholder: "Enter your campaign name",
};

const defaultPromoteTargetClassName = "topsort-promote-target";
const modalProductIdTargetId = "topsort-modal-product-id";

const logPrefix = "[Topsort Elements]";
const logger = {
  info: (...msg: any[]) => console.log(logPrefix, ...msg),
  warn: (...msg: any[]) => console.warn(logPrefix, ...msg),
  error: (...msg: any[]) => console.error(logPrefix, ...msg),
};

type InitParams = {
  apiKey: ApiKey;
};

type CustomClassName = {
  className: string;
  replace?: boolean;
};

type Style = Partial<
  Record<"button" | "buttonText" | "modal", CustomClassName>
>;

type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;

const modalClassName = "topsort-promote-modal";
const defaultModalStyles = [
  "position: fixed;",
  "flex-direction: column;",
  "align-items: center;",
  "top: 50%;",
  "left: 50%;",
  "transform: translate(-50%, -50%);",
  "height: 20rem;",
  "max-height: 85vh;",
  "padding: 1rem;",
  "border: 1px solid black;",
  "border-radius: 0.5rem;",
  "background-color: white;",
  "box-shadow: 0px 5px 8px rgb(0 0 0 / 10%);",
  "z-index: 1;",
];
const modalShowClassName = "topsort-promote-modal--show";
const modalShowStyles = ["display: flex;"];
const modalHideClassName = "topsort-promote-modal--hide";
const modalHideStyles = ["display: none;"];

const modalCloseButtonClassName = "topsort-promote-modal__close-button";
const modalCloseButtonStyles = [
  "position: absolute;",
  "top: 0.5rem;",
  "right: 0.5rem;",
  "cursor: pointer;",
];

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

function ensureSemiColons(lines: string[]) {
  return lines.map((line) => (line.endsWith(";") ? line : `${line};`));
}

function formatStyleContent(className: string, styles: string[]) {
  return `.${className} {\n  ${ensureSemiColons(styles).join("\n  ")}\n}\n\n`;
}

function createModal({ style, text }: { style?: Style; text?: CustomText }) {
  const modal = document.createElement("div");

  modal.classList.add(modalHideClassName);
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  if (style?.modal) {
    modal.classList.add(style.modal.className);
  }
  if (!style?.modal?.replace) {
    modal.classList.add(modalClassName);
  }

  const closeButton = document.createElement("button");
  closeButton.innerText = "✕";
  closeButton.classList.add(modalCloseButtonClassName);
  closeButton.addEventListener("click", () => {
    modal.classList.remove(modalShowClassName);
    modal.classList.add(modalHideClassName);
    delete modal.dataset.topsortProductId;
  });

  const title = document.createElement("h2");
  title.innerText = text?.modalTitle || defaultText.modalTitle;
  const subtitle = document.createElement("h3");
  subtitle.innerText = text?.modalSubtitle || defaultText.modalSubtitle;

  const productIdTarget = document.createElement("span");
  productIdTarget.setAttribute("id", modalProductIdTargetId);

  const campaignNameInput = document.createElement("input");
  campaignNameInput.placeholder =
    text?.modalCampaignNamePlaceholder ||
    defaultText.modalCampaignNamePlaceholder;

  [closeButton, title, subtitle, productIdTarget, campaignNameInput].forEach(
    (element) => modal.appendChild(element)
  );

  return modal;
}

function createStyleSheet(style?: Style) {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = "";

  styleSheet.textContent += formatStyleContent(
    modalShowClassName,
    modalShowStyles
  );

  styleSheet.textContent += formatStyleContent(
    modalHideClassName,
    modalHideStyles
  );

  styleSheet.textContent += formatStyleContent(
    modalCloseButtonClassName,
    modalCloseButtonStyles
  );

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

  if (!style?.modal?.replace) {
    styleSheet.textContent += formatStyleContent(
      modalClassName,
      defaultModalStyles
    );
  }

  /*
   * NOTE(christopherbot)
   * To support consumers extending our default styles, this style sheet is
   * prepended instead of appended so it comes before other style sheets so
   * other style sheets take higher priority.
   */
  document.head.prepend(styleSheet);
}

function createButton({
  productId,
  modal,
  style,
  text,
}: {
  productId: string;
  modal: HTMLElement;
  style?: Style;
  text?: CustomText;
}) {
  const button = document.createElement("button");

  if (style?.button) {
    button.classList.add(style.button.className);
  }
  if (!style?.button?.replace) {
    button.classList.add(buttonClassName);
  }

  const buttonText = document.createElement("span");
  buttonText.innerText = text?.button || defaultText.button;
  if (style?.buttonText) {
    buttonText.classList.add(style.buttonText.className);
  }
  if (!style?.buttonText?.replace) {
    buttonText.classList.add(buttonTextClassName);
  }

  button.appendChild(buttonText);

  button.addEventListener("click", () => {
    const productIdTarget = modal.querySelector(`#${modalProductIdTargetId}`);
    modal.dataset.topsortProductId = productId;
    if (productIdTarget instanceof HTMLElement) {
      productIdTarget.innerText = productId;
    }
    modal.classList.remove(modalHideClassName);
    modal.classList.add(modalShowClassName);
  });

  return button;
}

type InitProductPromotion = {
  modalTargetClassName?: string;
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

export default class TopsortElements {
  private apiToken?: string;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  constructor(params: InitParams) {
    if (typeof params !== "object") {
      logger.error('Method "init" is missing the required params object.');
      return;
    }

    if (!params.apiKey) {
      logger.error(
        'Method "init" is missing the required apiKey in the params object.'
      );
      return;
    }

    // TODO(christopherbot) server-side validation
    const validate = (a: any) => a;
    const apiToken = validate(params.apiKey);

    this.apiToken = apiToken;
  }

  initProductPromotion({
    modalTargetClassName,
    promoteTargetClassName,
    style,
    text,
  }: InitProductPromotion = {}) {
    if (!this.apiToken) {
      logger.warn(
        'Cannot call "initProductPromotion" before calling "init" with the apiKey.'
      );
      return;
    }

    const modalTarget =
      (modalTargetClassName &&
        document.querySelector(`.${modalTargetClassName}`)) ||
      document.body;

    const modal = createModal({
      style,
      text,
    });

    modalTarget.appendChild(modal);

    createStyleSheet(style);

    const promoteTargets = [
      ...document.getElementsByClassName(
        promoteTargetClassName || defaultPromoteTargetClassName
      ),
    ];

    promoteTargets.forEach((target) => {
      if (!(target instanceof HTMLElement)) return;

      const productId = target.dataset.topsortProductId;

      if (!productId) {
        logger.warn(
          "Skipping button on element with no data-topsort-product-id."
        );
        return;
      }

      const button = createButton({
        productId,
        modal,
        style,
        text,
      });
      target.appendChild(button);

      // target.attachShadow({
      //   mode: "open",
      // });

      // if (target.shadowRoot) {
      //   render(<PromoteButton />, target.shadowRoot);
      // }
      render(<PromoteButton />, target);
    });

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );
    }
  }
}