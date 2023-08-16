import { Button } from "@components/Button";
import { useFormatCurrencyWithoutSymbol } from "@components/CampaignDetails/Edit";
import { Icon } from "@components/Icon";
import { BudgetInput } from "@components/Input/BudgetInput";
import { DaysInput } from "@components/Input/DaysInput";
import { RangeInputWithTooltip } from "@components/Input/RangeInput";
import { Tooltip } from "@components/Tooltip";
import { CampaignEstimation } from "@components/common";
import { usePromotionContext } from "@context";
import { minDurationDays, maxDurationDays } from "@state";
import { currencyStringToInt } from "@utils/currency";
import { FunctionalComponent, Fragment } from "preact";
import { ChangeEvent, useRef, useState } from "preact/compat";

import { getMaxBudget } from "./utils";

export const BudgetAndDuration: FunctionalComponent = () => {
  const { state, dispatch, currency, language } = usePromotionContext();
  const {
    defaultBudget,
    campaignCreation: { dailyBudget, durationDays },
  } = state;

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [tooltipInputDailyBudget, setTooltipInputDailyBudget] = useState("");
  const [tooltipInputDays, setTooltipInputDays] = useState("");

  const formatCurrencyWithoutSymbol = useFormatCurrencyWithoutSymbol(
    language,
    currency
  );

  const setDailyBudget = (newBudget: number) => {
    dispatch({
      type: "campaign creation daily budget updated",
      payload: {
        amount: newBudget,
      },
    });
  };
  const setDays = (newDays: number) => {
    dispatch({
      type: "campaign creation duration updated",
      payload: {
        days: newDays,
      },
    });
  };

  const handleSetIsEditingBudget = (isEditing: boolean) => {
    if (isEditing === isEditingBudget) return;
    if (wrapperBudgetRef.current) {
      wrapperBudgetRef.current.style.width = `${wrapperBudgetRef.current.clientWidth}px`;
    }
    if (isEditing) {
      setTooltipInputDailyBudget(
        formatCurrencyWithoutSymbol(dailyBudget / currency.divisor)
      );
    } else {
      setDailyBudget(currencyStringToInt(tooltipInputDailyBudget, currency));
    }
    setIsEditingBudget(isEditing);
  };

  const handleSetIsEditingDays = (isEditing: boolean) => {
    if (isEditing === isEditingDays) return;
    if (isEditing) {
      if (wrapperDaysRef.current) {
        wrapperDaysRef.current.style.width = `${wrapperDaysRef.current.clientWidth}px`;
      }
      setTooltipInputDays(String(durationDays));
    } else {
      setDays(Number(tooltipInputDays));
    }
    setIsEditingDays(isEditing);
  };
  const wrapperBudgetRef = useRef<HTMLDivElement>(null);
  const wrapperDaysRef = useRef<HTMLDivElement>(null);

  const budgetTooltipContent = (
    <div ref={wrapperBudgetRef} className="ts-tooltip-content ts-space-x-1">
      {isEditingBudget ? (
        <BudgetInput
          autofocus
          showSymbol={false}
          hasborder={false}
          setDailyBudget={setTooltipInputDailyBudget}
          dailyBudget={tooltipInputDailyBudget}
          formatCurrencyWithoutSymbol={formatCurrencyWithoutSymbol}
          defaultDailyBudget={dailyBudget}
          onEnterPress={() => handleSetIsEditingBudget(false)}
        />
      ) : (
        <div>{formatCurrencyWithoutSymbol(dailyBudget / currency.divisor)}</div>
      )}
      <div>{currency.code}</div>
    </div>
  );

  const daysTooltipContent = (
    <div ref={wrapperDaysRef} className="ts-tooltip-content ts-space-x-1">
      {isEditingDays ? (
        <DaysInput
          autofocus
          durationDays={tooltipInputDays}
          setDurationDays={setTooltipInputDays}
          defaultDurationDays={durationDays}
          hasBorder={false}
          showArrowButtons={false}
          onEnterPress={() => handleSetIsEditingDays(false)}
        />
      ) : (
        <Fragment>
          <div>{durationDays}</div>
          <div>{durationDays === 1 ? "Day" : "Days"}</div>
        </Fragment>
      )}
    </div>
  );

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div>
        <div className="ts-flex ts-space-x-2">
          <span className="ts-text-md ts-font-bold">Budget and duration</span>
          <Tooltip
            content="Budget is the amount of money you are willing to spend on ads; duration is the number of days of promotion."
            placement="bottom"
            offsetOptions={{
              mainAxis: 5,
            }}
          >
            <Icon size={24} name="message-question" />
          </Tooltip>
        </div>
        <div className="ts-campaign-creation__range">
          <span className="ts-text-sm ts-font-bold">Set a daily budget</span>
          <RangeInputWithTooltip
            value={dailyBudget}
            min={currency.divisor}
            max={getMaxBudget(defaultBudget)}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              // Casting needing due to preact bug:
              // https://github.com/preactjs/preact/issues/1930
              setDailyBudget(Number((event.target as HTMLInputElement).value));
            }}
            setIsEditing={handleSetIsEditingBudget}
            tooltipProps={{
              content: budgetTooltipContent,
              alwaysShow: true,
              hidden: dailyBudget === 0,
              light: !isEditingBudget,
            }}
          />
        </div>
        <div className="ts-campaign-creation__range">
          <span className="ts-text-sm ts-font-bold">Set a duration</span>
          <RangeInputWithTooltip
            setIsEditing={handleSetIsEditingDays}
            value={durationDays}
            min={minDurationDays}
            max={maxDurationDays}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              // Casting needing due to preact bug:
              // https://github.com/preactjs/preact/issues/1930
              setDays(Number((event.target as HTMLInputElement).value));
            }}
            tooltipProps={{
              content: daysTooltipContent,
              alwaysShow: true,
              hidden: durationDays === 0,
              light: !isEditingDays,
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
