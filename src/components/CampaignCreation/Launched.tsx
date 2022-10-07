import { CampaignBudget, CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const Launched: FunctionalComponent = () => {
  const { state } = useProductPromotion();
  const { dailyBudget, durationDays } = state.campaignCreation;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <CampaignSummary />
        <CampaignBudget budget={dailyBudget * 100} days={durationDays} />
      </div>
    </div>
  );
};
