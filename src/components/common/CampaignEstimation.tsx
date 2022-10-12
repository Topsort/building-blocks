import { Icon } from "@components/Icon";
import { useProductPromotion } from "@context";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import { useMemo } from "preact/hooks";

export const CampaignEstimation: FunctionalComponent<
  JSX.IntrinsicElements["div"] & {
    dailyBudget: number;
    durationDays: number;
  }
> = ({ className, dailyBudget, durationDays, ...props }) => {
  const {
    currencyCode,
    numberFormater,
    state: { marketplaceCpc },
  } = useProductPromotion();

  const { minClicks, maxClicks } = useMemo(
    () => ({
      minClicks: Math.floor(
        durationDays * (dailyBudget / marketplaceCpc.upperBound)
      ),
      maxClicks: Math.ceil(
        durationDays * (dailyBudget / marketplaceCpc.lowerBound)
      ),
    }),
    [
      durationDays,
      dailyBudget,
      marketplaceCpc.lowerBound,
      marketplaceCpc.upperBound,
    ]
  );

  const formattedDailyBudget =
    currencyCode === "USD" ? dailyBudget / 100 : dailyBudget;

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
        With a{" "}
        <span className="ts-font-bold">
          {/* TODO make it generic */}
          {formattedDailyBudget.toFixed(2)} {currencyCode}
        </span>{" "}
        budget in{" "}
        <span className="ts-font-bold">
          {durationDays} {durationDays === 1 ? "day" : "days"}
        </span>{" "}
        we estimate{" "}
        <span className="ts-text-primary">
          {minClicks === maxClicks
            ? numberFormater.format(minClicks)
            : `between ${numberFormater.format(
                minClicks
              )} and ${numberFormater.format(maxClicks)}`}
        </span>{" "}
        clicks.
      </span>
    </div>
  );
};
