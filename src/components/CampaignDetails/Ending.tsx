import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

import { Metrics } from "./Metrics";

export const Ending: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { dispatch } = useProductPromotion();
  // TODO (samet): Fetch the email from central services or somewhere else
  const email = "example@domain.com";

  return (
    <div className="ts-space-y-4">
      <CampaignSummary />
      <Metrics title="Final Metrics" campaign={campaign} />
      <div className="ts-space-y-2-5">
        <span className="ts-campaign-ending__email-text">
          We will send a summary of metrics to your email ({email}).
        </span>
        <Button
          color="danger"
          fullWidth
          variant="contained"
          onClick={() => dispatch({ type: "end campaign button clicked" })}
        >
          End campaign
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => dispatch({ type: "end campaign back button clicked" })}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};
