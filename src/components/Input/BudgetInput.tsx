import { Input } from "@components/Input";
import { usePromotionContext } from "@context";
import { currencyStringToInt } from "@utils/currency";
import { h, FunctionalComponent } from "preact";

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

  const cleanDailyBudget = (value: string) => {
    let intValue = currencyStringToInt(value, currency);

    if (intValue === 0) {
      intValue = defaultDailyBudget;
    }

    return formatCurrencyWithoutSymbol(intValue / currency.divisor);
  };

  return (
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
  );
};
