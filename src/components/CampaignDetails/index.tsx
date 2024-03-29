import { Campaign } from "@api/types";
import { BackButton } from "@components/Button";
import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { logger } from "@utils/logger";
import { FunctionalComponent, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import { Details } from "./Details";
import { Edit } from "./Edit";
import { Ending } from "./Ending";
import { MultiProduct } from "./MultiProduct";
import "./style.css";

export { CampaignEnded } from "./CampaignEnded";

export const CampaignDetails: FunctionalComponent<{
  campaignId: Campaign["campaignId"];
}> = ({ campaignId }) => {
  const { authToken, vendorId, state, dispatch, centralServicesUrl } =
    usePromotionContext();
  const {
    campaignsById,
    shopCampaignId,
    campaignDetails: { step },
  } = state;

  const campaign = campaignsById[campaignId];
  const isShopCampaign = campaignId === shopCampaignId;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (campaign) return;

    async function getCampaign() {
      try {
        const campaign = await services.getCampaign(
          centralServicesUrl,
          authToken,
          vendorId,
          campaignId
        );
        const report = await services.getCampaignReport(
          centralServicesUrl,
          authToken,
          campaignId
        );

        dispatch({
          type: "campaign retrieved",
          payload: { campaign, report },
        });
      } catch (error) {
        logger.error(`Failed to get campaign (id="${campaignId}").`, error);
        setHasError(true);
      }
    }

    getCampaign();
  }, [authToken, vendorId, campaign, campaignId, dispatch, centralServicesUrl]);

  useEffect(() => {
    // If the modal for a different campaign is opened,
    // reset back to the first step
    return () => {
      dispatch({ type: "campaign details reset" });
    };
  }, [dispatch, campaignId]);

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

    if ((campaign.activeBidsCount ?? 0) > 1) {
      return {
        title: "This product is already under an active campaign",
        content: <MultiProduct />,
      };
    }

    switch (step) {
      case "details": {
        if (!isShopCampaign) {
          return {
            title: "Campaign Details",
            content: <Details campaign={campaign} />,
          };
        }
        return {
          title: "Reporting",
          content: <Details campaign={campaign} isShopCampaign />,
        };
      }
      case "editing": {
        return {
          title: (
            <Fragment>
              <BackButton
                onClick={() =>
                  dispatch({ type: "edit campaign back button clicked" })
                }
              />
              <span>Edit Budget/Duration</span>
            </Fragment>
          ),
          content: <Edit campaign={campaign} />,
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

    if ((campaign.activeBidsCount ?? 0) > 1) {
      return "fit-content";
    }

    switch (step) {
      case "details":
        return "24rem";
      case "editing":
        return "fit-content";
      case "ending":
        return "fit-content";
      default:
        return undefined;
    }
  })();

  return (
    <Fragment>
      <ModalHeading title={title} />
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </Fragment>
  );
};
