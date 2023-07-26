import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { Input } from "@components/Input";
import { CampaignEstimation } from "@components/common";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { maxDurationDays } from "@state";
import { currencyStringToInt } from "@utils/currency";
import { dayDifference } from "@utils/datetime";
import { logger } from "@utils/logger";
import { h, FunctionalComponent } from "preact";
import { useState, useMemo, useCallback } from "preact/hooks";

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

  const formatCurrencyWithoutSymbol = useCallback(
    (number: number) =>
      number.toLocaleString(language, {
        minimumFractionDigits: currency.exponent,
        maximumFractionDigits: currency.exponent,
      }),
    [language, currency.exponent]
  );

  const defaultDailyBudget = useMemo(() => {
    const budget = campaign.budget.amount;
    switch (campaign.budget.type) {
      case "daily":
        return budget;
      case "weekly":
        return budget / 7;
      default:
        // TODO(christopherbot) do we need to handle 28, 30, 31 days depending on month?
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

  const budgetInputFilter = (value: string) => {
    const decimal = currency.decimalSeparator;
    const exponent = currency.exponent;

    if (decimal) {
      const disallowedCharacters = new RegExp(`[^0-9\\${decimal}]`, "g");
      // This regex is used to prevent more digits after the decimal than allowed
      const afterDecimalRegex = new RegExp(
        `(\\${decimal}[0-9]{0,${exponent}}).*`,
        "g"
      );
      return value
        .replace(disallowedCharacters, "")
        .replace(afterDecimalRegex, "$1");
    }

    const disallowedCharacters = new RegExp(`[^0-9]`, "g");
    return value.replace(disallowedCharacters, "");
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

  const cleanDailyBudget = (value: string) => {
    let intValue = currencyStringToInt(value, currency);

    if (intValue === 0) {
      intValue = defaultDailyBudget;
    }

    return formatCurrencyWithoutSymbol(intValue / currency.divisor);
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

  const durationAfterText =
    (durationDays ? durationDaysInt : defaultDurationDays) === 1
      ? "day"
      : "days";

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
          <Input
            {...(currency.isSymbolAtStart
              ? { before: currency.symbol }
              : { after: currency.symbol })}
            value={dailyBudget}
            inputFilter={budgetInputFilter}
            onInput={setDailyBudget}
            onBlur={(event) => onBudgetBlur(event as unknown as FocusEvent)}
            required
            placeholder={formatCurrencyWithoutSymbol(
              defaultDailyBudget / currency.divisor
            )}
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
