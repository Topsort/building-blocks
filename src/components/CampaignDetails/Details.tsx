import { Campaign } from "@api/types";
import { CampaignBudget, CampaignSummary } from "@components/common";
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
        productImageUrl="https://picsum.photos/68"
        showSummaryTime
      />
      <CampaignBudget
        budget={campaign.budget.amount}
        // days={campaign.days}
        days={4}
        onEdit={() => dispatch({ type: "edit campaign button clicked" })}
      />
      <hr className="ts-hr" />
      <Metrics title="Metrics" campaign={campaign} />
    </div>
  );
};
