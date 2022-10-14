import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { RangeInputWithTooltip } from "@components/Input";
import { Tooltip } from "@components/Tooltip";
import { CampaignEstimation } from "@components/common";
import { useProductPromotion } from "@context";
import { minDurationDays, maxDurationDays } from "@state";
import { h, FunctionalComponent } from "preact";
import { ChangeEvent } from "preact/compat";

import { getMaxBudget, getMinBudget } from "./utils";

export const BudgetAndDuration: FunctionalComponent = () => {
  const { state, dispatch, currencyCode } = useProductPromotion();
  const {
    defaultBudget,
    campaignCreation: { dailyBudget, durationDays },
  } = state;
  const formattedDailyBudget =
    currencyCode === "USD" ? dailyBudget / 100 : dailyBudget;

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
            min={getMinBudget(currencyCode)}
            max={getMaxBudget(defaultBudget)}
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
              content: `${formattedDailyBudget.toFixed(2)} ${currencyCode}`,
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
              content: `${durationDays} ${durationDays === 1 ? "Day" : "Days"}`,
              alwaysShow: true,
              hidden: durationDays === 0,
              light: true,
            }}
          />
        </div>
        <CampaignEstimation
          className="ts-campaign-creation__details-callout"
          dailyBudget={dailyBudget}
          durationDays={durationDays}
        />
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
