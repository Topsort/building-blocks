import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { CampaignEstimation } from "@components/common/CampaignEstimation";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

export const Edit: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const { dispatch } = useProductPromotion();

  const defaultDailyBudget = () => {
    const budget = campaign.budget.amount;
    switch (campaign.budget.type) {
      case "daily":
        return budget;
      case "weekly":
        return budget / 7;
      default:
        return budget / 30;
    }
  };

  const defaultDurationDays = () => {
    // TODO (samet) User time-related utilty functions
    const startTime = new Date(campaign.startDate).getTime();
    const endTime = new Date(campaign.endDate).getTime();
    const days = Math.ceil((endTime - startTime) / (1000 * 3600 * 24));
    return days < 30 ? days : 30;
  };

  const [dailyBudget, setDailyBudget] = useState(() => {
    const budget = defaultDailyBudget();
    return (budget / 100).toFixed(2);
  });
  const [durationDays, setDurationDays] = useState(() => {
    return String(defaultDurationDays());
  });

  const onBudgetInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    // TODO (samet) Handle the other currencies
    const cleanedValue = target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\.[0-9]{0,2}).*/g, "$1");
    target.value = cleanedValue;
    setDailyBudget(cleanedValue);
  };

  const onBudgetBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDailyBudget(target.value);
    setDailyBudget(finalValue);
  };

  const onDayInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    const cleanedValue = target.value.replace(/[^0-9]/g, "");
    const intValue = Number(cleanedValue);
    const finalValue = !cleanedValue || intValue < 30 ? cleanedValue : "30";
    target.value = finalValue;
    setDurationDays(finalValue);
  };

  const onDayBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDurationDays(target.value);
    setDurationDays(finalValue);
  };

  const onSave = (event: SubmitEvent) => {
    event.preventDefault();
    // TODO : save campaign
    setDailyBudget(cleanDailyBudget(dailyBudget));
    setDurationDays(cleanDurationDays(durationDays));

    dispatch({
      type: "modal close button clicked",
    });
  };

  const cleanDailyBudget = (value: string) => {
    const [integer, fractional] = value.split(".");
    let intValue = 0;
    if (integer) {
      intValue += Number(integer) * 100;
    }
    if (fractional) {
      if (fractional.length === 1) {
        intValue += Number(fractional) * 10;
      } else if (fractional.length === 2) {
        intValue += Number(fractional);
      }
    }

    if (intValue === 0) {
      intValue = defaultDailyBudget();
    }

    return (intValue / 100).toFixed(2);
  };

  const cleanDurationDays = (value: string) => {
    const intValue = Number(value);
    return !value || intValue === 0 ? String(defaultDurationDays()) : value;
  };

  return (
    <div class="ts-space-y-5">
      <CampaignEstimation
        dailyBudget={Number(dailyBudget)}
        durationDays={Number(durationDays)}
        minEstimatedClick={1000}
        maxEstimatedClick={1500}
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
            onInput={(event) => onBudgetInput(event as unknown as InputEvent)}
            onBlur={(event) => onBudgetBlur(event as unknown as FocusEvent)}
            type="text"
            placeholder="7.00"
          />
        </label>
        <label class="ts-edit-form__item">
          <span>Set a duration</span>
          <Input
            after="days"
            value={durationDays}
            onInput={(event) => onDayInput(event as unknown as InputEvent)}
            onBlur={(event) => onDayBlur(event as unknown as FocusEvent)}
            type="text"
            placeholder="15"
          />
        </label>
        <Button type="submit" fullWidth variant="contained">
          Save
        </Button>
      </form>
      <hr class="ts-hr" />
      <div class="ts-flex ts-justify-center">Or</div>
      <Button
        color="secondary"
        fullWidth
        variant="contained"
        onClick={() => dispatch({ type: "edit campaign end button clicked" })}
      >
        End Campaign
      </Button>
    </div>
  );
};
