import { h, FunctionalComponent, Fragment } from "preact";

export const Summary: FunctionalComponent<{
  dailyBudget: number;
  durationDays: number;
  imgSrc: string;
  showTargetingText?: boolean;
}> = ({ dailyBudget, durationDays, imgSrc, showTargetingText = false }) => {
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
        <div className="ts-budget-duration">
          <span>
            ${dailyBudget} over {durationDays} days
          </span>
          {showTargetingText && <span>with automatic targeting.</span>}
        </div>
      </div>
    </Fragment>
  );
};
