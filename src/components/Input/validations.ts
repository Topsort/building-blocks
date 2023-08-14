import { Currency } from "@types";
import { currencyStringToInt } from "@utils/currency";

export const dayInputFilter = (maxDurationDays: number) => {
  return (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    const intValue = Number(cleanedValue);
    const finalValue =
      !cleanedValue || intValue < maxDurationDays
        ? cleanedValue
        : String(maxDurationDays);
    return finalValue;
  };
};

export const cleanDurationDays = (
  value: string,
  defaultDurationDays: number,
  minDurationDays: number
) => {
  if (!value) {
    return String(defaultDurationDays);
  }
  if (Number(value) < minDurationDays) {
    return String(minDurationDays);
  }
  return value;
};

export const budgetInputFilter = (currency: Currency) => {
  return (value: string) => {
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
};

export const cleanDailyBudget = (
  value: string,
  currency: Currency,
  defaultDailyBudget: number,
  formatCurrencyWithoutSymbol: (value: number) => string
) => {
  let intValue = currencyStringToInt(value, currency);

  if (intValue === 0) {
    intValue = defaultDailyBudget;
  }

  return formatCurrencyWithoutSymbol(intValue / currency.divisor);
};

const canvasContext = (() => {
  const canvas = document.createElement("canvas");
  return canvas.getContext("2d");
})();

export const calculateTextWidth = (text: string, font: string): number => {
  if (canvasContext) {
    canvasContext.font = font;
  }
  return canvasContext?.measureText(text).width ?? 0;
};
