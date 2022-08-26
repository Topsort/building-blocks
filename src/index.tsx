import { CampaignCreation } from "@components/CampaignCreation";
import { Modal } from "@components/Modal";
import Portal from "@components/Portal";
import { PromoteButton } from "@components/PromoteButton";
import { defaultPromoteTargetClassName, portalRootId } from "@constants";
import { ProductPromotionContext, useProductPromotion } from "@context";
import * as services from "@services/central-services";
import { CustomText, Style } from "@types";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h, render } from "preact";
import { useEffect, useState } from "preact/hooks";

import "./app.css";

const App: FunctionalComponent = () => {
  const { promoteTargetClassName } = useProductPromotion();
  const [productId, setProductId] = useState<string | null>(null);
  const [promoteTargets, setPromoteTargets] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const promoteTargets = [
      ...document.getElementsByClassName(promoteTargetClassName),
    ];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );
    }

    setPromoteTargets(promoteTargets as HTMLElement[]);
  }, [promoteTargetClassName]);

  return (
    <Fragment>
      {promoteTargets.map((promoteTarget, index) => {
        const productId = promoteTarget.dataset.tsProductId;

        if (!productId) {
          logger.warn("Skipping button on element with no data-ts-product-id.");
          return null;
        }

        return (
          <Portal key={index} target={promoteTarget}>
            <PromoteButton
              key={index}
              onClick={() => {
                setProductId(productId);
              }}
            />
          </Portal>
        );
      })}
      <Portal target={`#${portalRootId}`}>
        <Modal
          onClose={() => {
            setProductId(null);
          }}
          isOpen={!!productId}
        >
          <CampaignCreation productId={productId} />
        </Modal>
      </Portal>
    </Fragment>
  );
};

type InitParams = {
  apiKey: string;
  externalVendorId: string;
};

type InitProductPromotion = {
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

export default class TopsortElements {
  private authToken?: string;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  async init(params: InitParams) {
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

    try {
      const authToken = await services.validateVendor(
        params.apiKey,
        params.externalVendorId
      );
      this.authToken = authToken;
    } catch (error) {
      logger.error("[validateVendor]", error);
    }
  }

  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }: InitProductPromotion = {}) {
    if (!this.authToken) {
      logger.warn('Cannot call "initProductPromotion" without an authToken.');
      return;
    }

    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", portalRootId);
    document.body.appendChild(portalRoot);

    render(
      <ProductPromotionContext.Provider
        value={{
          promoteTargetClassName:
            promoteTargetClassName || defaultPromoteTargetClassName,
          style: style || {},
          text: text || {},
        }}
      >
        <App />
      </ProductPromotionContext.Provider>,
      document.body
    );
  }
}
