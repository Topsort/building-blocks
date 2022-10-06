import { PromoteButton } from "@components/Button";
import { CampaignCreation } from "@components/CampaignCreation";
import { CampaignDetails } from "@components/CampaignDetails";
import { Modal } from "@components/Modal";
import Portal from "@components/Portal";
import { defaultPromoteTargetClassName } from "@constants";
import { ProductPromotionContext, useProductPromotion } from "@context";
import { useAsync } from "@hooks/use-async";
import * as services from "@services/central-services";
import { initialState, reducer } from "@state";
import { CustomText, Style } from "@types";
import {
  getInvalidRgbWarning,
  isRgbValid,
  setDocumentStyleProperty,
} from "@utils/custom-styles";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h, render } from "preact";
import { useCallback, useEffect, useReducer, useState } from "preact/hooks";

import "./app.css";
import "./utils.css";

const App: FunctionalComponent = () => {
  const { authToken, vendorId, promoteTargetClassName, style } =
    useProductPromotion();
  const [productId, setProductId] = useState<string | null>(null);
  const [promoteTargets, setPromoteTargets] = useState<HTMLElement[]>([]);

  // Set up color variables for custom theming
  useEffect(() => {
    if (!style) return;

    const { primaryColorRgb, fontColorRgb } = style;

    if (primaryColorRgb) {
      if (isRgbValid(primaryColorRgb)) {
        setDocumentStyleProperty("--ts-primary-rgb", primaryColorRgb);
      } else {
        logger.warn(getInvalidRgbWarning("--ts-primary-rgb", primaryColorRgb));
      }
    }
    if (fontColorRgb) {
      if (isRgbValid(fontColorRgb)) {
        setDocumentStyleProperty("--ts-font-rgb", fontColorRgb);
      } else {
        logger.warn(getInvalidRgbWarning("--ts-font-rgb", fontColorRgb));
      }
    }
  }, [style]);

  useEffect(() => {
    const promoteTargets = [
      ...document.getElementsByClassName(promoteTargetClassName),
    ];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );

      return;
    }

    setPromoteTargets(promoteTargets as HTMLElement[]);
  }, [promoteTargetClassName]);

  const getCampaignIdsByProductId = useAsync(
    useCallback(
      () =>
        services.getCampaignIdsByProductId(
          authToken,
          vendorId,
          promoteTargets
            .map((promoteTarget) => promoteTarget.dataset.tsProductId)
            .filter((productId): productId is string => !!productId)
        ),
      [authToken, vendorId, promoteTargets]
    ),
    false
  );

  useEffect(() => {
    if (promoteTargets.length > 0) {
      getCampaignIdsByProductId.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoteTargets, getCampaignIdsByProductId.execute]);

  useEffect(() => {
    if (getCampaignIdsByProductId.status === "error") {
      logger.error(
        "[getCampaignIdsByProductId]",
        getCampaignIdsByProductId.error
      );
    }
  }, [getCampaignIdsByProductId.status, getCampaignIdsByProductId.error]);

  const campaignId = productId
    ? getCampaignIdsByProductId.value?.[productId]
    : null;

  return (
    <Fragment>
      {promoteTargets.map((promoteTarget, index) => {
        const productId = promoteTarget.dataset.tsProductId;

        if (!productId) {
          return null;
        }

        const { status } = getCampaignIdsByProductId;

        return (
          <Portal key={index} target={promoteTarget}>
            <PromoteButton
              key={index}
              onClick={() => {
                setProductId(productId);
              }}
              status={status}
              hasCampaign={!!getCampaignIdsByProductId.value?.[productId]}
            />
          </Portal>
        );
      })}
      <Portal target={document.body}>
        <Modal
          onClose={() => {
            setProductId(null);
          }}
          isOpen={!!productId}
        >
          {productId &&
            (campaignId ? (
              <CampaignDetails campaignId={campaignId} />
            ) : (
              <CampaignCreation productId={productId} />
            ))}
        </Modal>
      </Portal>
    </Fragment>
  );
};

const AppWithContext: FunctionalComponent<{
  authToken: string;
  vendorId: string;
  promoteTargetClassName: string;
  style: Style;
  text: CustomText;
}> = ({ authToken, vendorId, promoteTargetClassName, style, text }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProductPromotionContext.Provider
      value={{
        authToken,
        vendorId,
        promoteTargetClassName,
        style,
        text,
        state,
        dispatch,
      }}
    >
      <App />
    </ProductPromotionContext.Provider>
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

export default class TopsortBlocks {
  private authToken?: string;
  private vendorId?: string;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  async init(params: InitParams) {
    if (typeof params !== "object") {
      logger.error('Method "init" is missing the required params object.');
      return;
    }

    if (!params.apiKey || !params.externalVendorId) {
      if (!params.apiKey) {
        logger.error(
          'Method "init" is missing the required apiKey in the params object.'
        );
      }

      if (!params.externalVendorId) {
        logger.error(
          'Method "init" is missing the required externalVendorId in the params object.'
        );
      }

      return;
    }

    this.vendorId = params.externalVendorId;

    try {
      const { authToken } = await services.validateVendor(
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
    if (!this.authToken || !this.vendorId) {
      if (!this.authToken) {
        logger.warn(
          'Cannot call "initProductPromotion" without an authToken set.'
        );
      }

      if (!this.vendorId) {
        logger.warn(
          'Cannot call "initProductPromotion" without a vendorId set.'
        );
      }

      return;
    }

    render(
      <AppWithContext
        authToken={this.authToken}
        vendorId={this.vendorId}
        promoteTargetClassName={
          promoteTargetClassName || defaultPromoteTargetClassName
        }
        style={style || {}}
        text={text || {}}
      />,
      document.body
    );
  }
}
