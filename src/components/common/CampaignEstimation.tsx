import { Icon } from "@components/Icon";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

export const CampaignEstimation: FunctionalComponent<
  JSX.IntrinsicElements["div"] & {
    dailyBudget: number;
    durationDays: number;
    minEstimatedClick: number;
    maxEstimatedClick: number;
  }
> = ({
  className,
  dailyBudget,
  durationDays,
  minEstimatedClick,
  maxEstimatedClick,
  ...props
}) => {
  return (
    <div
      className={cx(
        "ts-callout ts-flex ts-items-center ts-space-x-4",
        className
      )}
      {...props}
    >
      <Icon name="info-circle" className="ts-rotate-180" />
      <span className="ts-text-sm ts-font-semimedium">
        With a <span className="ts-font-bold">{dailyBudget} USD</span> budget in{" "}
        <span className="ts-font-bold">{durationDays} days</span> we estimate{" "}
        <span className="ts-text-primary">
          between {minEstimatedClick} and {maxEstimatedClick}
        </span>{" "}
        clicks.
      </span>
    </div>
  );
};
