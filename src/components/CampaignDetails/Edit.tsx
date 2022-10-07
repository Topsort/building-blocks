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

  const [dailyBudget, setDailyBudget] = useState("");
  const [durationDays, setDurationDays] = useState("");

  const onBudgetInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    // TODO (samet) Handle the other currencies
    const cleanedValue = target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\.[0-9]{0,2}).*/g, "$1");
    target.value = cleanedValue;
    setDailyBudget(cleanedValue);
  };

  const onDayInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    const cleanedValue = target.value.replace(/[^0-9]/g, "");
    target.value = cleanedValue;
    setDurationDays(cleanedValue);
  };

  const onSave = (event: SubmitEvent) => {
    event.preventDefault();
    // TODO : save campaign
  };

  return (
    <div class="ts-space-y-5">
      <CampaignEstimation
        dailyBudget={5}
        durationDays={12}
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
