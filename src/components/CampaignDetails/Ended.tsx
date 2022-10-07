import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { h, FunctionComponent } from "preact";

import { Metrics } from "./Metrics";

export const Ended: FunctionComponent<{ campaign: Campaign }> = ({
  campaign,
}) => {
  const { dispatch } = useProductPromotion();
  return (
    <div className="ts-space-y-5">
      <CampaignSummary />
      <Metrics title="Final Metrics" campaign={campaign} />
      <Button
        fullWidth
        variant="contained"
        onClick={() => dispatch({ type: "modal close button clicked" })}
      >
        Close
      </Button>
    </div>
  );
};
