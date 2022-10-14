import { MS_PER_DAY } from "@constants";

export const dayDifference = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / MS_PER_DAY;
};
