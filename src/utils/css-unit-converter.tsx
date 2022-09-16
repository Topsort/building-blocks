export const remToPx = (rem: string) => {
  const rootFontSize =
    parseInt(getComputedStyle(document.documentElement).fontSize, 10) || 16;
  return parseFloat(rem) * rootFontSize;
};
