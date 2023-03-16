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
import { validationService } from "@services/validation-service";
import { initialState, reducer, State } from "@state";
import {
  Currency,
  CustomText,
  initialParamsSchema,
  InitParams,
  RequestStatus,
  Style,
} from "@types";
import {
  getInvalidRgbWarning,
  isRgbValid,
  setDocumentStyleProperty,
} from "@utils/custom-styles";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h, render } from "preact";
import { useEffect, useMemo, useReducer, useRef, useState } from "preact/hooks";

import "./app.css";
import "./utils.css";

const App: FunctionalComponent = () => {
  const {
    authToken,
    vendorId,
    promoteTargetClassName,
    style,
    counter,
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
  const [statusesByProductId, setStatusesByProductId] = useState<
    Record<string, RequestStatus>
  >({});
  const currentCounter = useRef(counter);

  const promoteTargetIds = useMemo(() => {
    return promoteTargets
      .map((promoteTarget) => promoteTarget.dataset.tsProductId ?? "")
      .sort()
      .join("-");
  }, [promoteTargets]);

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
      if (selectedProductId) {
        dispatch({ type: "modal close button clicked" });
      }
      setPromoteTargets([]);
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

    if (selectedProductId && !(selectedProductId in productDataById)) {
      dispatch({ type: "modal close button clicked" });
    }

    dispatch({
      type: "promote targets retrieved",
      payload: {
        productDataById,
      },
    });

    setPromoteTargets(promoteTargets);
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      We don't need to run this effect after selectedProductId changes.
      We are using it to check if the selected product is still
      in the view when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, promoteTargetClassName, counter]);

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

  const updateStatuses = (productIds: string[], status: RequestStatus) => {
    setStatusesByProductId((prev) => ({
      ...prev,
      ...productIds.reduce(
        (statuses, productId) =>
          Object.assign(statuses, { [productId]: status }),
        {} as Record<string, RequestStatus>
      ),
    }));
  };

  useEffect(() => {
    const getCampaignIdsByProductId = async () => {
      if (promoteTargets.length === 0) return;

      currentCounter.current = counter;

      const newProductIds = promoteTargets
        .map((promoteTarget) => promoteTarget.dataset.tsProductId)
        .filter(
          (productId): productId is string =>
            !!productId && !(productId in campaignIdsByProductId)
        );

      if (newProductIds.length === 0) return;

      updateStatuses(newProductIds, "pending");

      try {
        const campaignIdsByProductId = await services.getCampaignIdsByProductId(
          authToken,
          vendorId,
          newProductIds
        );

        updateStatuses(newProductIds, "success");
        dispatch({
          type: "campaign ids by product id retrieved",
          payload: { campaignIdsByProductId },
        });
      } catch (error) {
        if (counter < currentCounter.current) {
          return;
        }

        updateStatuses(newProductIds, "error");
        logger.error("Failed to get campaign ids by product id.", error);
      }
    };

    getCampaignIdsByProductId();
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      It is not necessary to run this effect when new products
      are added to campaignIdsByProductId.
      We are using it to determine which products are already fetched
      when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authToken, vendorId, promoteTargetIds]);

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
              status={statusesByProductId[productId] || "idle"}
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
  counter: number;
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
  counter,
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
        counter,
      }}
    >
      <App />
    </ProductPromotionContext.Provider>
  );
};

export default class TopsortBlocks {
  private authToken?: string;
  private vendorId?: string;
  private marketplaceDetails?: MarketplaceDetails;
  private promoteTargetClassName: InitParams["promoteTargetClassName"];
  private style: InitParams["style"];
  private text: InitParams["text"];
  private formatNumber?: Intl.NumberFormat["format"];
  private formatMoney?: (
    number: number
  ) => ReturnType<Intl.NumberFormat["format"]>;
  private currency?: Currency;
  /*
    NOTE (samet)
    We are increasing the counter variable when the library consumer
    calls "useProductPromotion".
    The purpose is to run some of the effects in the "App" component.
  */
  private counter = 0;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  async init(params: InitParams) {
    try {
      const { apiKey, externalVendorId, promoteTargetClassName, style, text } =
        initialParamsSchema.parse(params);
      const { authToken, authorized } =
        await validationService.getValidationToken(apiKey, externalVendorId);

      if (!authorized) {
        throw new Error("Api Key not valid");
      }

      this.vendorId = externalVendorId;
      this.authToken = authToken;
      const marketplaceDetails = await services.getMarketplaceDetails(
        this.authToken
      );
      this.marketplaceDetails = marketplaceDetails;
      const { currencyCode, currencyExponent, languagePreference } =
        this.marketplaceDetails;

      const moneyFormat = new Intl.NumberFormat(languagePreference, {
        style: "currency",
        currency: currencyCode,
      });
      const moneyParts = moneyFormat.formatToParts(largeNumberWithDecimals);
      const currencyDivisor = Math.pow(10, currencyExponent);

      this.formatNumber = new Intl.NumberFormat(languagePreference).format;
      this.formatMoney = (number: number) =>
        moneyFormat.format(number / currencyDivisor);
      this.currency = {
        code: currencyCode,
        divisor: currencyDivisor,
        exponent: currencyExponent,
        decimalSeparator: moneyParts.find((part) => part.type === "decimal")
          ?.value,
        groupSeparator: moneyParts.find((part) => part.type === "group")?.value,
        symbol:
          moneyParts.find((part) => part.type === "currency")?.value || "$",
        isSymbolAtStart:
          moneyParts.findIndex((part) => part.type === "currency") <
          moneyParts.findIndex((part) => part.type === "integer"),
      };
      this.promoteTargetClassName = promoteTargetClassName;
      this.style = style;
      this.text = text;
    } catch (error) {
      logger.error("Failed to get marketplace details.", error);
    }
  }

  useProductPromotion() {
    if (
      !this.authToken ||
      !this.vendorId ||
      !this.marketplaceDetails ||
      !this.currency ||
      !this.formatNumber ||
      !this.formatMoney
    ) {
      if (!this.authToken) {
        logger.warn(
          'Cannot call "useProductPromotion" without an authToken set.'
        );
      }

      if (!this.vendorId) {
        logger.warn(
          'Cannot call "useProductPromotion" without a vendorId set.'
        );
      }

      if (!this.marketplaceDetails) {
        logger.warn(
          'Cannot call "useProductPromotion" without marketplace details.'
        );
      }

      return;
    }

    this.counter++;

    render(
      <AppWithContext
        authToken={this.authToken}
        vendorId={this.vendorId}
        language={this.marketplaceDetails.languagePreference}
        currency={this.currency}
        formatNumber={this.formatNumber}
        formatMoney={this.formatMoney}
        promoteTargetClassName={
          this.promoteTargetClassName || defaultPromoteTargetClassName
        }
        style={this.style || {}}
        text={this.text || {}}
        counter={this.counter}
      />,
      document.body
    );
  }
}
