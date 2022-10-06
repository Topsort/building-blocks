import { Campaign } from "@api/types";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { MS_PER_DAY } from "@constants";
import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Metrics } from "./Metrics";
import { useCampaignDetails } from "./context";

export const Details: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { dispatch } = useCampaignDetails();
  const days = useMemo(() => {
    const end = new Date(campaign.endDate);

    if (end.getFullYear() === 9999) {
      return "infinite";
    }

    const start = new Date(campaign.startDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.round(timeDiff / MS_PER_DAY);
  }, [campaign.startDate, campaign.endDate]);

  return (
    <div className="ts-space-y-3-5">
      <CampaignSummary
        name={campaign.name}
        productImageUrl="https://picsum.photos/68"
        startDate={campaign.startDate}
      />
      <CampaignBudget
        budget={campaign.budget.amount}
        days={days}
        onEdit={() => dispatch({ type: "edit campaign button clicked" })}
      />
      <hr className="ts-hr" />
      <Metrics title="Metrics" campaign={campaign} />
    </div>
  );
};
