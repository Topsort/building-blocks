import { h, FunctionalComponent, Fragment } from "preact";

import { useCampaignCreation } from "./context";

export const Summary: FunctionalComponent<{
  imgSrc: string;
  showTargetingText?: boolean;
}> = ({ imgSrc, showTargetingText = false }) => {
  const { state } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;
  return (
    <Fragment>
      <div className="ts-callout ts-flex ts-items-center ts-space-x-4">
        <img className="ts-product-image ts-product-image--md" src={imgSrc} />
        <span className="ts-font-medium">Too faced hangover primer</span>
      </div>
      <div className="ts-space-y-2">
        <span className="ts-block ts-text-md ts-font-medium">
          Budget and duration
        </span>
        <span className="ts-budget-duration">
          ${dailyBudget} over {durationDays} days
          {showTargetingText ? <span>with automatic targeting.</span> : "."}
        </span>
      </div>
    </Fragment>
  );
};
