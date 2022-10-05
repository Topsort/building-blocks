import { CampaignBudget, CampaignSummary } from "@components/common";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

import { Metrics } from "./Metrics";
import { useCampaignDetails } from "./context";

export const Details: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { dispatch } = useCampaignDetails();

  return (
    <div className="ts-space-y-3-5">
      <CampaignSummary
        name={campaign.name}
        productImageUrl={campaign.productImageUrl}
        showSummaryTime
      />
      <CampaignBudget
        budget={campaign.budget}
        days={campaign.days}
        onEdit={() => dispatch({ type: "edit campaign button clicked" })}
      />
      <hr className="ts-hr" />
      <Metrics title="Metrics" campaign={campaign} />
    </div>
  );
};
