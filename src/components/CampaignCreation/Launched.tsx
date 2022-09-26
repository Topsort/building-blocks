import { Summary } from "@components/CampaignCreation/Summary";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";

export const Launched: FunctionalComponent = () => {
  const { state } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;

  return (
    <div className="ts-campaign-creation__content ts-justify-between ts-space-y-8">
      <div className="ts-space-y-8">
        <Summary
          dailyBudget={dailyBudget}
          durationDays={durationDays}
          imgSrc="https://picsum.photos/76"
        />
      </div>
    </div>
  );
};
