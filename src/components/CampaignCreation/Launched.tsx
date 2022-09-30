import { CampaignBudget, CampaignSummary } from "@components/common";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";

export const Launched: FunctionalComponent = () => {
  const { state } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <CampaignSummary
          productImageUrl="https://picsum.photos/76"
          name="Too faced hangover primer"
        />
        <CampaignBudget budget={dailyBudget} days={durationDays} />
      </div>
    </div>
  );
};
