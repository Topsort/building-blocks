import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { services } from "@services/central-services";
import { logger } from "@utils/logger";
import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import { Metrics } from "./Metrics";

export const Ending: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { authToken, vendorId, dispatch, state } = useProductPromotion();
  const { selectedProductId } = state;

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // TODO (samet): Fetch the email from central services or somewhere else
  // const email = "example@domain.com";

  const endCampaign = async () => {
    if (selectedProductId === null) {
      logger.error("Failed to end campaign. No product is selected.");
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      await services.endCampaign(authToken, vendorId, campaign.campaignId);

      dispatch({
        type: "campaign ended",
        payload: {
          campaign,
          productId: selectedProductId,
        },
      });
    } catch (error) {
      logger.error("Failed to end campaign.", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ts-space-y-4">
      <CampaignSummary />
      <Metrics title="Final Metrics" campaign={campaign} />
      <div className="ts-space-y-2-5">
        {/*
          TODO (samet) Uncomment this and the related css once we fetch email
          from central-services
          <span className="ts-campaign-ending__email-text">
          We will send a summary of metrics to your email ({email}).
          </span>*/}
        {hasError && (
          <span className="ts-flex ts-items-center ts-text-danger ts-space-x-2">
            <Icon name="info-circle-bold" />
            <span>Something went wrong.</span>
          </span>
        )}
        <Button
          color="danger"
          fullWidth
          variant="contained"
          onClick={endCampaign}
          disabled={isLoading}
        >
          End campaign
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => dispatch({ type: "end campaign back button clicked" })}
          disabled={isLoading}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};
