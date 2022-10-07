import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { CampaignSummary } from "@components/common";
import { h, FunctionComponent } from "preact";

import { Metrics } from "./Metrics";

export const Ended: FunctionComponent<{ campaign: Campaign }> = ({
  campaign,
}) => {
  return (
    <div className="ts-space-y-5">
      <CampaignSummary />
      <Metrics title="Final Metrics" campaign={campaign} />
      {/* TODO(samet): close the modal */}
      <Button fullWidth variant="contained">
        Close
      </Button>
    </div>
  );
};
