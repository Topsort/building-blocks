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
    return campaign.budget.amount;
  };

  const defaultDurationDays = () => {
    // TODO (samet) User time-related utilty functions
    const startTime = new Date(campaign.startDate).getTime();
    const endTime = new Date(campaign.endDate).getTime();
    return (endTime - startTime) / (1000 * 3600 * 24);
  };

  const [dailyBudget, setDailyBudget] = useState(() => {
    const budget = defaultDailyBudget();
    return `${Math.floor(budget / 100)}.${String(budget % 100).padEnd(2, "0")}`;
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
    const [integer, fractional] = target.value.split(".");
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

    const finalValue = `${Math.floor(intValue / 100)}.${String(
      intValue % 100
    ).padEnd(2, "0")}`;
    target.value = finalValue;
    console.log({
      integer,
      fractional,
      finalValue,
    });
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
    const intValue = Number(target.value);
    const finalValue =
      !target.value || intValue === 0
        ? String(defaultDurationDays())
        : target.value;
    target.value = finalValue;
    setDurationDays(finalValue);
  };

  const onSave = (event: SubmitEvent) => {
    event.preventDefault();
    // TODO : save campaign
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
