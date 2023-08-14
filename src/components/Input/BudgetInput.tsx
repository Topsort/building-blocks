import {
  budgetInputFilter,
  cleanDailyBudget,
} from "@components/Input/validations";
import { usePromotionContext } from "@context";
import { h, FunctionalComponent } from "preact";

import { Input } from ".";

export const BudgetInput: FunctionalComponent<{
  dailyBudget: string;
  setDailyBudget: (budget: string) => void;
  formatCurrencyWithoutSymbol: (value: number) => string;
  defaultDailyBudget: number;
}> = ({
  dailyBudget,
  setDailyBudget,
  formatCurrencyWithoutSymbol,
  defaultDailyBudget,
}) => {
  const { currency } = usePromotionContext();

  const onBudgetBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const finalValue = cleanDailyBudget(
      target.value,
      currency,
      defaultDailyBudget,
      formatCurrencyWithoutSymbol
    );
    setDailyBudget(finalValue);
  };

  return (
    <Input
      {...(currency.isSymbolAtStart
        ? { before: currency.symbol }
        : { after: currency.symbol })}
      value={dailyBudget}
      inputFilter={budgetInputFilter(currency)}
      onInput={setDailyBudget}
      onBlur={(event) => onBudgetBlur(event as unknown as FocusEvent)}
      required
      placeholder={formatCurrencyWithoutSymbol(
        defaultDailyBudget / currency.divisor
      )}
    />
  );
};
