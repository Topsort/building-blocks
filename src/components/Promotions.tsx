import { CampaignCreation } from "@components/CampaignCreation";
import { CampaignDetails, CampaignEnded } from "@components/CampaignDetails";
import { Modal } from "@components/Modal";
import { Portal } from "@components/Portal";
import { PromotionContext, usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { initialState, reducer } from "@state";
import { Currency, CustomText, Style } from "@types";
import {
  getInvalidRgbWarning,
  isRgbValid,
  setDocumentStyleProperty,
} from "@utils/custom-styles";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useReducer } from "preact/hooks";

import { PromoteProduct } from "./PromoteProduct";

const TopsortPromotions: FunctionalComponent = () => {
  const {
    centralServicesUrl,
    authToken,
    vendorId,
    style,
    dispatch,
    isUsingProductPromotion,
    state: {
      isModalOpen,
      selectedCampaignId,
      campaignCreation,
      lastDeletedCampaign,
    },
  } = usePromotionContext();

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
    const getDefaultBudgetAndCpc = async () => {
      try {
        const response = await services.getDefaultBudgetAndCpc(
          centralServicesUrl,
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
  }, [dispatch, authToken, vendorId, centralServicesUrl]);

  return (
    <Fragment>
      {isUsingProductPromotion && <PromoteProduct />}
      <Portal target={document.body}>
        <Modal
          onClose={() => dispatch({ type: "modal close button clicked" })}
          isOpen={isModalOpen}
          isCloseButtonHidden={!!lastDeletedCampaign}
        >
          {lastDeletedCampaign ? (
            <CampaignEnded campaign={lastDeletedCampaign} />
          ) : /*
           * Don't show the Details if the campaign was just launched so that
           * the user still sees the Launched screen in the creation flow
           */
          selectedCampaignId && campaignCreation.step !== "launched" ? (
            <CampaignDetails campaignId={selectedCampaignId} />
          ) : (
            <CampaignCreation />
          )}
        </Modal>
      </Portal>
    </Fragment>
  );
};

export const TopsortPromotionsWithContext: FunctionalComponent<{
  centralServicesUrl: string;
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
  isUsingProductPromotion: boolean;
}> = ({
  centralServicesUrl,
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
  isUsingProductPromotion,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PromotionContext.Provider
      value={{
        centralServicesUrl,
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
        isUsingProductPromotion,
      }}
    >
      <TopsortPromotions />
    </PromotionContext.Provider>
  );
};
