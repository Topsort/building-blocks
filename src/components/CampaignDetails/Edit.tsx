import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { BudgetInput } from "@components/Input/BudgetInput";
import { DaysInput } from "@components/Input/DaysInput";
import { CampaignEstimation } from "@components/common";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { maxDurationDays } from "@state";
import { Currency } from "@types";
import { currencyStringToInt } from "@utils/currency";
import { dayDifference } from "@utils/datetime";
import { logger } from "@utils/logger";
import { FunctionalComponent } from "preact";
import { useState, useMemo, useCallback } from "preact/hooks";

export const useFormatCurrencyWithoutSymbol = (
  language: string,
  currency: Currency
) => {
  return useCallback(
    (number: number) =>
      number.toLocaleString(language, {
        minimumFractionDigits: currency.exponent,
        maximumFractionDigits: currency.exponent,
      }),
    [language, currency.exponent]
  );
};

export const useDefaultDailyBudget = (budget: {
  amount: number;
  type: "daily" | "weekly" | "monthly";
}) => {
  return useMemo(() => {
    switch (budget.type) {
      case "daily":
        return budget.amount;
      case "weekly":
        return budget.amount / 7;
      default:
        // TODO(christopherbot) do we need to handle 28, 30, 31 days depending on month?
        return budget.amount / 30;
    }
  }, [budget]);
};

export const Edit: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const {
    authToken,
    currency,
    vendorId,
    dispatch,
    language,
    centralServicesUrl,
  } = usePromotionContext();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formatCurrencyWithoutSymbol = useFormatCurrencyWithoutSymbol(
    language,
    currency
  );

  const defaultDailyBudget = useDefaultDailyBudget(
    campaign.budget ?? {
      amount: 0,
      type: "daily",
    }
  );

  const defaultDurationDays = useMemo(() => {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    const days = Math.ceil(dayDifference(startDate, endDate));
    return days < maxDurationDays ? days : maxDurationDays;
  }, [campaign.startDate, campaign.endDate]);

  const [dailyBudget, setDailyBudget] = useState(() => {
    return formatCurrencyWithoutSymbol(defaultDailyBudget / currency.divisor);
  });
  const [durationDays, setDurationDays] = useState(() => {
    return String(defaultDurationDays);
  });

  const dailyBudgetInt = currencyStringToInt(dailyBudget, currency);
  const durationDaysInt = Number(durationDays);

  const isChanged =
    defaultDailyBudget !== dailyBudgetInt ||
    defaultDurationDays !== durationDaysInt;

  const onSave = (event: SubmitEvent) => {
    event.preventDefault();

    let dailyBudgetInt = currencyStringToInt(dailyBudget, currency);
    if (dailyBudgetInt === 0) {
      dailyBudgetInt = defaultDailyBudget;
    }
    const durationDaysInt = Number(durationDays);

    setDailyBudget(
      formatCurrencyWithoutSymbol(dailyBudgetInt / currency.divisor)
    );
    setDurationDays(String(durationDaysInt));
    editCampaign(dailyBudgetInt, durationDaysInt);
  };

  const editCampaign = async (dailyBudget: number, durationDays: number) => {
    setIsLoading(true);
    setHasError(false);

    const startDate = new Date(campaign.startDate);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + durationDays);

    try {
      const editedCampaign = await services.updateCampaign(
        centralServicesUrl,
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
  const minDurationDays = useMemo(() => {
    const startDate = new Date(campaign.startDate);
    const pastDays = Math.ceil(dayDifference(startDate, new Date()));
    if (!!pastDays && pastDays > 0) return pastDays;
    return 1;
  }, [campaign.startDate]);

  return (
    <div class="ts-space-y-5">
      <CampaignEstimation
        dailyBudget={dailyBudgetInt}
        durationDays={durationDaysInt}
      />
      <form
        className="ts-edit-form ts-space-y-5"
        onSubmit={(event) => onSave(event as unknown as SubmitEvent)}
      >
        <label class="ts-edit-form__item">
          <span>Set a daily budget</span>
          <BudgetInput
            setDailyBudget={setDailyBudget}
            dailyBudget={dailyBudget}
            formatCurrencyWithoutSymbol={formatCurrencyWithoutSymbol}
            defaultDailyBudget={defaultDailyBudget}
          />
        </label>
        <label class="ts-edit-form__item">
          <span>Set a duration</span>
          <DaysInput
            minDurationDays={minDurationDays}
            durationDays={durationDays}
            setDurationDays={setDurationDays}
            defaultDurationDays={defaultDurationDays}
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
        color="font"
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
