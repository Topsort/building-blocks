import { MS_PER_DAY } from "@constants";

export const dayDifference = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / MS_PER_DAY;
};

export const dateOptionsDict = {
  today: { label: "Today", duration: 1 },
  "last-7-days": { label: "Last 7 days", duration: 7 },
  "last-30-days": { label: "Last 30 days", duration: 30 },
  "last-60-days": { label: "Last 60 days", duration: 60 },
};

export type DateRangeOption = keyof typeof dateOptionsDict;

export function getOptionDates(option: DateRangeOption) {
  const today = new Date();
  const dateOffset = MS_PER_DAY * (dateOptionsDict[option].duration + 1);
  const startDate = new Date(today.getTime() - dateOffset);
  return { startDate, endDate: today };
}
