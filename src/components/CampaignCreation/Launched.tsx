import { CampaignBudget, CampaignSummary } from "@components/common";
import { usePromotionContext } from "@context";
import { h, FunctionalComponent } from "preact";

export const Launched: FunctionalComponent = () => {
  const { state } = usePromotionContext();
  const { dailyBudget, durationDays } = state.campaignCreation;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <CampaignSummary />
        <CampaignBudget budget={dailyBudget} days={durationDays} />
      </div>
    </div>
  );
};
