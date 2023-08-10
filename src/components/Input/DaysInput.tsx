import { Input } from "@components/Input";
import { maxDurationDays } from "@state";
import { h, FunctionalComponent } from "preact";

export const DaysInput: FunctionalComponent<{
  durationDays: string;
  setDurationDays: (days: string) => void;
  defaultDurationDays: number;
  minDurationDays?: number;
}> = ({
  durationDays,
  setDurationDays,
  defaultDurationDays,
  minDurationDays = 1,
}) => {
  const durationDaysInt = Number(durationDays);

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

  const cleanDurationDays = (value: string) => {
    if (!value) {
      return String(defaultDurationDays);
    }
    if (Number(value) < minDurationDays) {
      return String(minDurationDays);
    }
    return value;
  };

  const durationAfterText =
    (durationDays ? durationDaysInt : defaultDurationDays) === 1
      ? "day"
      : "days";

  return (
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
  );
};
