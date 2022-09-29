import { Summary } from "@components/CampaignCreation/Summary";
import { h, FunctionalComponent } from "preact";

export const Launched: FunctionalComponent = () => {
  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <Summary imgSrc="https://picsum.photos/76" />
      </div>
    </div>
  );
};
