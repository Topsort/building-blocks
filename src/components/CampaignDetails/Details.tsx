import { Campaign } from "@api/types";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { MS_PER_DAY } from "@constants";
import { usePromotionContext } from "@context";
import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Metrics } from "./Metrics";

export const Details: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { dispatch } = usePromotionContext();
  const days = useMemo(() => {
    const end = new Date(campaign.endDate);

    if (end.getUTCFullYear() === 9999) {
      return "infinite";
    }

    const start = new Date(campaign.startDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.round(timeDiff / MS_PER_DAY);
  }, [campaign.startDate, campaign.endDate]);

  return (
    <div className="ts-space-y-3-5">
      <CampaignSummary startDate={campaign.startDate} />
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
