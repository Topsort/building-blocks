import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { RangeInputWithTooltip } from "@components/Input";
import { Tooltip } from "@components/Tooltip";
import { h, Fragment, FunctionalComponent } from "preact";
import { ChangeEvent } from "preact/compat";

import { useCampaignCreation } from "./context";
import {
  minBudgetUSD,
  maxBudgetUSD,
  minDurationDays,
  maxDurationDays,
  minEstimatedClick,
  maxEstimatedClick,
} from "./state";

export const BudgetAndDuration: FunctionalComponent = () => {
  const { state, dispatch } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;

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
                type: "daily budget updated",
                payload: {
                  // Casting needing due to preact bug:
                  // https://github.com/preactjs/preact/issues/1930
                  amount: Number((event.target as HTMLInputElement).value),
                },
              });
            }}
            tooltipProps={{
              // TODO(christopherbot) use marketplace's currency:
              content: `${dailyBudget} USD`,
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
                type: "duration days updated",
                payload: {
                  // Casting needing due to preact bug:
                  // https://github.com/preactjs/preact/issues/1930
                  days: Number((event.target as HTMLInputElement).value),
                },
              });
            }}
            tooltipProps={{
              content:
                durationDays < maxDurationDays
                  ? `${durationDays} Days`
                  : "Active before being ended.",
              alwaysShow: true,
              hidden: durationDays === 0,
              light: true,
            }}
          />
        </div>
        <div className="ts-callout ts-flex ts-items-center ts-campaign-creation__details-callout ts-space-x-4">
          <Icon name="info-circle" className="ts-rotate-180" />
          <span className="ts-text-sm ts-font-semimedium">
            {durationDays < maxDurationDays ? (
              <Fragment>
                With a <span className="ts-font-bold">{dailyBudget} USD</span>{" "}
                budget in{" "}
                <span className="ts-font-bold">{durationDays} days</span> we
                estimate{" "}
                <span className="ts-text-primary">
                  between {minEstimatedClick} and {maxEstimatedClick}
                </span>{" "}
                clicks.
              </Fragment>
            ) : (
              <>Your campaign will be active infinitely until you end it.</>
            )}
          </span>
        </div>
      </div>
      <div className="ts-campaign-creation__footer ts-space-x-2">
        <Button
          variant="contained"
          onClick={() =>
            void dispatch({ type: "budget and duration next button clicked" })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
