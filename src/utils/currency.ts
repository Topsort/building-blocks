export const currencyStringToInt: (value: string) => number = (value) => {
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

  return intValue;
};
