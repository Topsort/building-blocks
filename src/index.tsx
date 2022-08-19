import { CampaignCreation } from "@components/CampaignCreation";
import { Modal } from "@components/Modal";
import Portal from "@components/Portal";
import { PromoteButton } from "@components/PromoteButton";
import {
  buttonClassName,
  buttonTextClassName,
  campaignCreationClassName,
  campaignCreationStyles,
  defaultButtonStyles,
  defaultButtonTextStyles,
  defaultModalStyles,
  defaultPromoteTargetClassName,
  modalClassName,
  modalCloseButtonClassName,
  modalCloseButtonStyles,
  modalHideClassName,
  modalHideStyles,
  modalShowClassName,
  modalShowStyles,
  portalRootId,
} from "@defaults";
import { ApiKey, CustomText, Style } from "@types";
import { FunctionalComponent, h, render } from "preact";
import { useEffect, useState } from "preact/hooks";

// TODO(christopherbot) figure out if we should import css file or
// continue building a stylesheet ourselves to prepend.
// import "./app.css";

const logPrefix = "[Topsort Elements]";
const logger = {
  info: (...msg: any[]) => console.log(logPrefix, ...msg),
  warn: (...msg: any[]) => console.warn(logPrefix, ...msg),
  error: (...msg: any[]) => console.error(logPrefix, ...msg),
};

type InitParams = {
  apiKey: ApiKey;
};

function ensureSemiColons(lines: string[]) {
  return lines.map((line) => (line.endsWith(";") ? line : `${line};`));
}

function formatStyleContent(className: string, styles: string[]) {
  return `.${className} {\n  ${ensureSemiColons(styles).join("\n  ")}\n}\n\n`;
}

function initStyles(style?: Style) {
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

  styleSheet.textContent += formatStyleContent(
    campaignCreationClassName,
    campaignCreationStyles
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

const App: FunctionalComponent<InitProductPromotion> = ({
  promoteTargetClassName,
  style,
  text,
}) => {
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {            setProductId(productId);

    initStyles(style);

    const promoteTargets = [
      ...document.getElementsByClassName(
        promoteTargetClassName || defaultPromoteTargetClassName
      ),
    ];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );
    }

    promoteTargets.forEach((target) => {
      if (!(target instanceof HTMLElement)) return;

      const productId = target.dataset.topsortProductId;

      if (!productId) {
        logger.warn(
          "Skipping button on element with no data-topsort-product-id."
        );
        return;
      }

      render(
        <PromoteButton
          style={style}
          text={text}
          onClick={() => {
            console.log("promote button clicked");
            setProductId(productId);
          }}
        />,
        target
      );
    });
  }, [promoteTargetClassName, style, text]);

  return (
    <Portal>
      <Modal
        style={style}
        text={text}
        onClose={() => {
          setProductId(null);
        }}
        isOpen={!!productId}
      >
        <CampaignCreation style={style} text={text} productId={productId} />
      </Modal>
    </Portal>
  );
};

type InitProductPromotion = {
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
    // Call an endpoint in CC with apiKey and vendorId, which would auth them and return an apiToken.
    // This code will have to be moved out of the ctor and into an async init method.
    const validate = (a: any) => a;
    const apiToken = validate(params.apiKey);

    this.apiToken = apiToken;
  }

  initProductPromotion({
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

    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", portalRootId);
    document.body.appendChild(portalRoot);

    // const appTarget = document.createElement("div");
    // document.body.appendChild(appTarget);
    render(
      <App
        promoteTargetClassName={promoteTargetClassName}
        style={style}
        text={text}
      />,
      document.body
    );
  }
}
