import { Currency } from "@types";

export const currencyStringToInt = (
  value: string,
  currency: Currency
): number => {
  if (currency.groupSeparator) {
    const regex = new RegExp(`\\${currency.groupSeparator}`, "g");
    value = value.replace(regex, "");
  }

  if (!currency.decimalSeparator) {
    return Number(value);
  }

  const parts = value.split(currency.decimalSeparator);
  const integer = parts[0];
  let fractional = parts[1];

  let intValue = 0;
  if (integer) {
    intValue += Number(integer) * currency.divisor;
  }

  if (fractional) {
    if (fractional.length !== currency.exponent) {
      fractional = fractional.padEnd(currency.exponent, "0");
    }
    intValue += Number(fractional);
  }

  return intValue;
};
