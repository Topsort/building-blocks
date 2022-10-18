import { MarketplaceDetails } from "@api/types";
import { PromoteButton } from "@components/Button";
import { CampaignCreation } from "@components/CampaignCreation";
import { CampaignDetails, CampaignEnded } from "@components/CampaignDetails";
import { Modal } from "@components/Modal";
import { Portal } from "@components/Portal";
import {
  defaultPromoteTargetClassName,
  largeNumberWithDecimals,
} from "@constants";
import { ProductPromotionContext, useProductPromotion } from "@context";
import { services } from "@services/central-services";
import { initialState, reducer, State } from "@state";
import { Currency, CustomText, RequestStatus, Style } from "@types";
import {
  getInvalidRgbWarning,
  isRgbValid,
  setDocumentStyleProperty,
} from "@utils/custom-styles";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h, render } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";

import "./app.css";
import "./utils.css";

const App: FunctionalComponent = () => {
  const {
    authToken,
    vendorId,
    promoteTargetClassName,
    style,
    dispatch,
    state: {
      isModalOpen,
      campaignIdsByProductId,
      selectedProductId,
      campaignCreation,
      lastDeletedCampaign,
    },
  } = useProductPromotion();
  const [promoteTargets, setPromoteTargets] = useState<HTMLElement[]>([]);
  const [campaignIdsByProductIdStatus, setCampaignIdsByProductIdStatus] =
    useState<RequestStatus>("idle");

  // Set up color variables for custom theming
  useEffect(() => {
    if (!style) return;

    const { primaryColorRgb, secondaryColorRgb, fontColorRgb } = style;

    if (primaryColorRgb) {
      if (isRgbValid(primaryColorRgb)) {
        setDocumentStyleProperty("--ts-primary-rgb", primaryColorRgb);
      } else {
        logger.warn(getInvalidRgbWarning("--ts-primary-rgb", primaryColorRgb));
      }
    }
    if (secondaryColorRgb) {
      if (isRgbValid(secondaryColorRgb)) {
        setDocumentStyleProperty("--ts-secondary-rgb", secondaryColorRgb);
      } else {
        logger.warn(
          getInvalidRgbWarning("--ts-secondary-rgb", secondaryColorRgb)
        );
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
    ] as HTMLElement[];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );

      return;
    }

    const productDataById = promoteTargets.reduce((dataById, promoteTarget) => {
      const productId = promoteTarget.dataset.tsProductId;
      const productName = promoteTarget.dataset.tsProductName;
      const productImgUrl = promoteTarget.dataset.tsProductImgUrl;

      if (productId && productName && productImgUrl) {
        dataById[productId] = {
          id: productId,
          name: productName,
          imgUrl: productImgUrl,
        };
      } else {
        logger.warn("Missing data attributes on promote target:", {
          "ts-product-id": productId || "(missing)",
          "ts-product-name": productName || "(missing)",
          "ts-product-img-url": productImgUrl || "(missing)",
        });
      }

      return dataById;
    }, {} as State["productDataById"]);

    dispatch({
      type: "promote targets retrieved",
      payload: {
        productDataById,
      },
    });

    setPromoteTargets(promoteTargets);
  }, [dispatch, promoteTargetClassName]);

  useEffect(() => {
    const getDefaultBudgetAndCpc = async () => {
      try {
        const response = await services.getDefaultBudgetAndCpc(
          authToken,
          vendorId
        );
        dispatch({
          type: "default budget and cpc retrieved",
          payload: response,
        });
      } catch (error) {
        logger.error("Failed to get default budget and CPC.", error);
      }
    };

    getDefaultBudgetAndCpc();
  }, [dispatch, authToken, vendorId]);

  useEffect(() => {
    const getCampaignIdsByProductId = async () => {
      if (promoteTargets.length === 0) return;

      setCampaignIdsByProductIdStatus("pending");

      try {
        const campaignIdsByProductId = await services.getCampaignIdsByProductId(
          authToken,
          vendorId,
          promoteTargets
            .map((promoteTarget) => promoteTarget.dataset.tsProductId)
            .filter((productId): productId is string => !!productId)
        );
        setCampaignIdsByProductIdStatus("success");
        dispatch({
          type: "campaign ids by product id retrieved",
          payload: { campaignIdsByProductId },
        });
      } catch (error) {
        setCampaignIdsByProductIdStatus("error");
        logger.error("Failed to get campaign ids by product id.", error);
      }
    };

    getCampaignIdsByProductId();
  }, [dispatch, authToken, vendorId, promoteTargets]);

  const campaignId = selectedProductId
    ? campaignIdsByProductId[selectedProductId]
    : null;

  return (
    <Fragment>
      {promoteTargets.map((promoteTarget, index) => {
        const productId = promoteTarget.dataset.tsProductId;

        if (!productId) {
          return null;
        }

        return (
          <Portal key={index} target={promoteTarget}>
            <PromoteButton
              key={index}
              onClick={() =>
                dispatch({ type: "product selected", payload: { productId } })
              }
              status={campaignIdsByProductIdStatus}
              hasCampaign={!!campaignIdsByProductId[productId]}
            />
          </Portal>
        );
      })}
      <Portal target={document.body}>
        <Modal
          onClose={() => dispatch({ type: "modal close button clicked" })}
          isOpen={isModalOpen}
          isCloseButtonHidden={!!lastDeletedCampaign}
        >
          {lastDeletedCampaign ? (
            <CampaignEnded campaign={lastDeletedCampaign} />
          ) : (
            selectedProductId &&
            /*
             * Don't show the Details if the campaign was just launched so that
             * the user still sees the Launched screen in the creation flow
             */
            (campaignId && campaignCreation.step !== "launched" ? (
              <CampaignDetails campaignId={campaignId} />
            ) : (
              <CampaignCreation />
            ))
          )}
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
  language: string;
  currency: Currency;
  formatNumber: Intl.NumberFormat["format"];
  formatMoney: (number: number) => ReturnType<Intl.NumberFormat["format"]>;
}> = ({
  authToken,
  vendorId,
  language,
  currency,
  formatNumber,
  formatMoney,
  promoteTargetClassName,
  style,
  text,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProductPromotionContext.Provider
      value={{
        authToken,
        vendorId,
        language,
        currency,
        formatNumber,
        formatMoney,
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
  private marketplaceDetails?: MarketplaceDetails;

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
      logger.error("Failed to validate vendor.", error);
    }

    try {
      if (this.authToken) {
        const marketplaceDetails = await services.getMarketplaceDetails(
          this.authToken
        );
        this.marketplaceDetails = marketplaceDetails;
      }
    } catch (error) {
      logger.error("Failed to get marketplace details.", error);
    }
  }

  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }: InitProductPromotion = {}) {
    if (!this.authToken || !this.vendorId || !this.marketplaceDetails) {
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

      if (!this.marketplaceDetails) {
        logger.warn(
          'Cannot call "initProductPromotion" without marketplace details.'
        );
      }

      return;
    }

    const language = this.marketplaceDetails.languagePreference;
    const currencyExponent = this.marketplaceDetails.currencyExponent;
    const currencyDivisor = Math.pow(10, currencyExponent);
    const numberFormat = new Intl.NumberFormat(language);
    const moneyFormat = new Intl.NumberFormat(language, {
      style: "currency",
      currency: this.marketplaceDetails.currencyCode,
    });
    const moneyParts = moneyFormat.formatToParts(largeNumberWithDecimals);

    render(
      <AppWithContext
        authToken={this.authToken}
        vendorId={this.vendorId}
        language={language}
        currency={{
          code: this.marketplaceDetails.currencyCode,
          divisor: currencyDivisor,
          exponent: currencyExponent,
          decimalSeparator: moneyParts.find((part) => part.type === "decimal")
            ?.value,
          groupSeparator: moneyParts.find((part) => part.type === "group")
            ?.value,
          symbol:
            moneyParts.find((part) => part.type === "currency")?.value || "$",
          isSymbolAtStart:
            moneyParts.findIndex((part) => part.type === "currency") <
            moneyParts.findIndex((part) => part.type === "integer"),
        }}
        formatNumber={numberFormat.format}
        formatMoney={(number: number) =>
          moneyFormat.format(number / currencyDivisor)
        }
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
