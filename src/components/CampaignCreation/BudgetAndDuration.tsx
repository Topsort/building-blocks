import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { RangeInputWithTooltip } from "@components/Input";
import { Tooltip } from "@components/Tooltip";
import { CampaignEstimation } from "@components/common/CampaignEstimation";
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
  const formattedDefaultBudget =
    currencyCode === "USD" ? defaultBudget / 100 : defaultBudget;

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
            value={formattedDailyBudget}
            min={getMinBudget(formattedDefaultBudget)}
            max={getMaxBudget(formattedDefaultBudget)}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              // Casting needing due to preact bug:
              // https://github.com/preactjs/preact/issues/1930
              const value = Number((event.target as HTMLInputElement).value);
              const amount = currencyCode === "USD" ? value * 100 : value;
              dispatch({
                type: "campaign creation daily budget updated",
                payload: {
                  amount,
                },
              });
            }}
            tooltipProps={{
              content: `${formattedDailyBudget} ${currencyCode}`,
              alwaysShow: true,
              hidden: formattedDailyBudget === 0,
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
