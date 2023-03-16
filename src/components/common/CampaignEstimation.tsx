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
    currency,
    formatNumber,
    formatMoney,
    state: { marketplaceCpc },
  } = useProductPromotion();

  const { minClicks, maxClicks } = useMemo(() => {
    const maxClicks = Math.ceil(
      durationDays * (dailyBudget / marketplaceCpc.lowerBound)
    );

    /*
     * If the upper and lower CPCs are the same, this likely means there isn't
     * enough marketplace data to make a ranged estimate, so simply divide the
     * max click estimate in half for the min click estimate.
     */
    const minClicks =
      marketplaceCpc.lowerBound === marketplaceCpc.upperBound
        ? Math.floor(maxClicks / 2)
        : Math.floor(durationDays * (dailyBudget / marketplaceCpc.upperBound));

    return { minClicks, maxClicks };
  }, [
    durationDays,
    dailyBudget,
    marketplaceCpc.lowerBound,
    marketplaceCpc.upperBound,
  ]);

  return (
    <div
      className={cx(
        "ts-callout ts-flex ts-items-center ts-space-x-4",
        className?.toString()
      )}
      {...props}
    >
      <Icon name="info-circle" className="ts-rotate-180" />
      <span className="ts-text-sm ts-font-semimedium">
        With a{" "}
        <span className="ts-font-bold">
          {formatMoney(dailyBudget)} {currency.code}
        </span>{" "}
        budget in{" "}
        <span className="ts-font-bold">
          {durationDays} {durationDays === 1 ? "day" : "days"}
        </span>{" "}
        we estimate{" "}
        <span className="ts-text-secondary">
          between {formatNumber(minClicks)} and {formatNumber(maxClicks)}
        </span>{" "}
        clicks.
      </span>
    </div>
  );
};
