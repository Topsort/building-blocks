import { Campaign } from "@api/types";
import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { useProductPromotion } from "@context";
import * as services from "@services/central-services";
import { h, FunctionalComponent, Fragment } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";

import { Details } from "./Details";
import { Ended } from "./Ended";
import { Ending } from "./Ending";
import { CampaignDetailsContext } from "./context";
import { initialState, reducer } from "./state";
import "./style.css";

export const CampaignDetails: FunctionalComponent<{
  campaignId: Campaign["campaignId"];
}> = ({ campaignId }) => {
  const {
    authToken,
    vendorId,
    state: { campaignsById },
    dispatch: productPromotionDispatch,
  } = useProductPromotion();

  const campaign = campaignsById[campaignId];
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (campaign) return;

    async function getCampaign() {
      try {
        const campaign = await services.getCampaign(
          authToken,
          vendorId,
          campaignId
        );

        productPromotionDispatch({
          type: "campaign retrieved",
          payload: { campaign },
        });
      } catch (error) {
        setHasError(true);
      }
    }

    getCampaign();
  }, [authToken, vendorId, campaign, campaignId, productPromotionDispatch]);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { step } = state;

  const { title, content } = (() => {
    if (!campaign) {
      return {
        title: "Campaign Details",
        content: (
          <div className="ts-flex ts-justify-center ts-items-center ts-h-full">
            {hasError ? (
              <span className="ts-flex ts-items-center ts-text-danger ts-space-x-2">
                <Icon name="info-circle-bold" />
                <span>Something went wrong.</span>
              </span>
            ) : (
              "Loading..."
            )}
          </div>
        ),
      };
    }

    switch (step) {
      case "details": {
        return {
          title: "Campaign Details",
          content: <Details campaign={campaign} />,
        };
      }
      case "ended": {
        return {
          title: (
            <Fragment>
              <Icon size={32} name="tick-circle" />
              <span>Your campaign ended!</span>
            </Fragment>
          ),
          content: <Ended campaign={campaign} />,
        };
      }
      case "ending": {
        return {
          title: "You're about to end this campaign",
          content: <Ending campaign={campaign} />,
        };
      }
    }
  })();

  const contentHeight = (() => {
    if (!campaign) {
      return "8rem";
    }

    switch (step) {
      case "details":
        return "24rem";
      case "ended":
        return "fit-content";
      case "ending":
        return "fit-content";
      default:
        return undefined;
    }
  })();

  return (
    <CampaignDetailsContext.Provider value={{ state, dispatch }}>
      <ModalHeading>{title}</ModalHeading>
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </CampaignDetailsContext.Provider>
  );
};
