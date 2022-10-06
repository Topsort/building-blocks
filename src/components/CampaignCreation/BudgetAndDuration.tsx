import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { RangeInputWithTooltip } from "@components/Input";
import { Tooltip } from "@components/Tooltip";
import { useProductPromotion } from "@context";
import {
  minBudgetUSD,
  maxBudgetUSD,
  minDurationDays,
  maxDurationDays,
  minEstimatedClick,
  maxEstimatedClick,
} from "@state";
import { h, FunctionalComponent } from "preact";
import { ChangeEvent } from "preact/compat";

export const BudgetAndDuration: FunctionalComponent = () => {
  const { state, dispatch, currencyCode } = useProductPromotion();
  const { dailyBudget, durationDays } = state.campaignCreation;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div>
        <div className="ts-flex ts-space-x-2">
          <span className="ts-text-md ts-font-medium">Budget and duration</span>
          <Tooltip
            content="The average amount you're willing to spend on your ads & the length of days you want the ads to show"
            placement="bottom"
            offsetOptions={{
              mainAxis: 5,
            }}
          >
            <Icon name="message-question" />
          </Tooltip>
        </div>
        <div className="ts-campaign-creation__range">
          <span className="ts-text-sm ts-font-medium">Set a daily budget</span>
          <RangeInputWithTooltip
            value={dailyBudget}
            min={minBudgetUSD}
            max={maxBudgetUSD}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                type: "campaign creation daily budget updated",
                payload: {
                  // Casting needing due to preact bug:
                  // https://github.com/preactjs/preact/issues/1930
                  amount: Number((event.target as HTMLInputElement).value),
                },
              });
            }}
            tooltipProps={{
              content: `${dailyBudget} ${currencyCode}`,
              alwaysShow: true,
              hidden: dailyBudget === 0,
              light: true,
            }}
          />
        </div>
        <div className="ts-campaign-creation__range">
          <span className="ts-text-sm ts-font-medium">Set a duration</span>
          <RangeInputWithTooltip
            value={durationDays}
            min={minDurationDays}
            max={maxDurationDays}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                type: "campaign creation duration updated",
                payload: {
                  // Casting needing due to preact bug:
                  // https://github.com/preactjs/preact/issues/1930
                  days: Number((event.target as HTMLInputElement).value),
                },
              });
            }}
            tooltipProps={{
              content: `${durationDays} Days`,
              alwaysShow: true,
              hidden: durationDays === 0,
              light: true,
            }}
          />
        </div>
        <div className="ts-callout ts-flex ts-items-center ts-campaign-creation__details-callout ts-space-x-4">
          <Icon name="info-circle" className="ts-rotate-180" />
          <span className="ts-text-sm ts-font-semimedium">
            With a{" "}
            <span className="ts-font-bold">
              {dailyBudget} {currencyCode}
            </span>{" "}
            budget in <span className="ts-font-bold">{durationDays} days</span>{" "}
            estimate{" "}
            <span className="ts-text-primary">
              between {minEstimatedClick} and {maxEstimatedClick}
            </span>{" "}
            clicks.
          </span>
        </div>
      </div>
      <div className="ts-campaign-creation__footer ts-space-x-2">
        <Button
          variant="contained"
          onClick={() =>
            dispatch({ type: "budget and duration next button clicked" })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
