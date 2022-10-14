export const currencyStringToInt = (
  value: string,
  currencyCode = "USD"
): number => {
  const [integer, cent] = value.split(".");
  const hasCent = currencyCode === "USD";

  let intValue = 0;
  if (integer) {
    intValue += Number(integer) * (hasCent ? 100 : 1);
  }
  if (hasCent && cent) {
    if (cent.length === 1) {
      intValue += Number(cent) * 10;
    } else if (cent.length === 2) {
      intValue += Number(cent);
    }
  }

  return intValue;
};
