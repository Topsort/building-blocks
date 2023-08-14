import { Input } from "@components/Input";
import {
  cleanDurationDays,
  dayInputFilter,
} from "@components/Input/validations";
import { maxDurationDays } from "@state";
import { h, FunctionalComponent } from "preact";

export const DaysInput: FunctionalComponent<{
  durationDays: string;
  setDurationDays: (days: string) => void;
  defaultDurationDays: number;
  minDurationDays?: number;
  hasBorder?: boolean;
  showArrowButtons?: boolean;
  autofocus?: boolean;
}> = ({
  durationDays,
  setDurationDays,
  defaultDurationDays,
  minDurationDays = 1,
  hasBorder = true,
  showArrowButtons = true,
  autofocus = false,
}) => {
  const onDayBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDurationDays(
      target.value,
      defaultDurationDays,
      minDurationDays
    );
    setDurationDays(finalValue);
  };

  const durationAfterText =
    (durationDays ? Number(durationDays) : defaultDurationDays) === 1
      ? "Day"
      : "Days";

  return (
    <Input
      after={durationAfterText}
      value={durationDays}
      inputFilter={dayInputFilter(maxDurationDays)}
      onInput={setDurationDays}
      onBlur={(event) => onDayBlur(event as unknown as FocusEvent)}
      min={minDurationDays}
      max={maxDurationDays}
      type="number"
      required
      placeholder={String(defaultDurationDays)}
      hasBorder={hasBorder}
      showArrowButtons={showArrowButtons}
      autofocus={autofocus}
    />
  );
};
