import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { Input } from "@components/Input";
import { CampaignEstimation } from "@components/common";
import { useProductPromotion } from "@context";
import { services } from "@services/central-services";
import { maxDurationDays } from "@state";
import { currencyStringToInt } from "@utils/currency";
import { dayDifference } from "@utils/datetime";
import { logger } from "@utils/logger";
import { h, FunctionalComponent } from "preact";
import { useState, useMemo } from "preact/hooks";

export const Edit: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { authToken, currencyCode, vendorId, dispatch } = useProductPromotion();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const defaultDailyBudget = useMemo(() => {
    const budget = campaign.budget.amount;
    switch (campaign.budget.type) {
      case "daily":
        return budget;
      case "weekly":
        return budget / 7;
      default:
        return budget / 30;
    }
  }, [campaign.budget]);

  const defaultDurationDays = useMemo(() => {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    const days = Math.ceil(dayDifference(startDate, endDate));
    return days < maxDurationDays ? days : maxDurationDays;
  }, [campaign.startDate, campaign.endDate]);

  const minDurationDays = useMemo(() => {
    const startDate = new Date(campaign.startDate);
    return Math.ceil(dayDifference(startDate, new Date()));
  }, [campaign.startDate]);

  const [dailyBudget, setDailyBudget] = useState(() => {
    return (defaultDailyBudget / 100).toFixed(2);
  });
  const [durationDays, setDurationDays] = useState(() => {
    return String(defaultDurationDays);
  });

  const isChanged = (() => {
    const dailyBudgetInt = currencyStringToInt(dailyBudget);
    const durationDaysInt = Number(durationDays);

    return (
      defaultDailyBudget !== dailyBudgetInt ||
      defaultDurationDays !== durationDaysInt
    );
  })();

  const budgetInputFilter = (value: string) => {
    // TODO (samet) Handle the other currencies
    return value.replace(/[^0-9.]/g, "").replace(/(\.[0-9]{0,2}).*/g, "$1");
  };

  const onBudgetBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDailyBudget(target.value);
    setDailyBudget(finalValue);
  };

  const dayInputFilter = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    const intValue = Number(cleanedValue);
    const finalValue =
      !cleanedValue || intValue < maxDurationDays
        ? cleanedValue
        : String(maxDurationDays);
    return finalValue;
  };

  const onDayBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDurationDays(target.value);
    setDurationDays(finalValue);
  };

  const onSave = (event: SubmitEvent) => {
    event.preventDefault();

    let dailyBudgetInt = currencyStringToInt(dailyBudget);
    if (dailyBudgetInt === 0) {
      dailyBudgetInt = defaultDailyBudget;
    }
    const durationDaysInt = Number(durationDays);

    setDailyBudget((dailyBudgetInt / 100).toFixed(2));
    setDurationDays(String(durationDaysInt));
    editCampaign(dailyBudgetInt, durationDaysInt);
  };

  const cleanDailyBudget = (value: string) => {
    let intValue = currencyStringToInt(value);

    if (intValue === 0) {
      intValue = defaultDailyBudget;
    }

    return (intValue / 100).toFixed(2);
  };

  const cleanDurationDays = (value: string) => {
    if (!value) {
      return String(defaultDurationDays);
    }
    if (Number(value) < minDurationDays) {
      return String(minDurationDays);
    }
    return value;
  };

  const editCampaign = async (dailyBudget: number, durationDays: number) => {
    setIsLoading(true);
    setHasError(false);

    const startDate = new Date(campaign.startDate);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + durationDays);

    try {
      const editedCampaign = await services.updateCampaign(
        authToken,
        vendorId,
        campaign.campaignId,
        {
          dailyBudget,
          endDate: newEndDate.toISOString(),
        }
      );

      dispatch({
        type: "campaign edited",
        payload: { campaignUpdate: editedCampaign },
      });
    } catch (error) {
      logger.error("Failed to edit campaign.", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const dailyBudgetNum = Number(dailyBudget);
  const durationAfterText =
    (durationDays ? Number(durationDays) : defaultDurationDays) === 1
      ? "day"
      : "days";

  return (
    <div class="ts-space-y-5">
      <CampaignEstimation
        dailyBudget={
          currencyCode === "USD" ? dailyBudgetNum * 100 : dailyBudgetNum
        }
        durationDays={Number(durationDays)}
      />
      <form
        className="ts-edit-form ts-space-y-5"
        onSubmit={(event) => onSave(event as unknown as SubmitEvent)}
      >
        <label class="ts-edit-form__item">
          <span>Set a daily budget</span>
          {/* TODO(samet): Handle the other currencies */}
          <Input
            before="$"
            value={dailyBudget}
            inputFilter={budgetInputFilter}
            onInput={setDailyBudget}
            onBlur={(event) => onBudgetBlur(event as unknown as FocusEvent)}
            required
            placeholder={(defaultDailyBudget / 100).toFixed(2)}
          />
        </label>
        <label class="ts-edit-form__item">
          <span>Set a duration</span>
          <Input
            after={durationAfterText}
            value={durationDays}
            inputFilter={dayInputFilter}
            onInput={setDurationDays}
            onBlur={(event) => onDayBlur(event as unknown as FocusEvent)}
            min={minDurationDays}
            max={maxDurationDays}
            type="number"
            required
            placeholder={String(defaultDurationDays)}
          />
        </label>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || !isChanged}
        >
          Save
        </Button>
      </form>
      {hasError && (
        <span className="ts-flex ts-items-center ts-text-danger ts-space-x-2">
          <Icon name="info-circle-bold" />
          <span>Something went wrong.</span>
        </span>
      )}
      <hr class="ts-hr" />
      <div class="ts-flex ts-justify-center">Or</div>
      <Button
        color="secondary"
        fullWidth
        variant="contained"
        onClick={() => dispatch({ type: "edit campaign end button clicked" })}
        disabled={isLoading}
      >
        End Campaign
      </Button>
    </div>
  );
};
