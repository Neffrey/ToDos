// TYPES
import { type TaskTimeframe } from "~/server/db/schema";

type IsWithinProps = {
  timeframe: TaskTimeframe;
  oldDate: Date;
  newDate: Date;
};

export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24; // Milliseconds * Seconds * Minutes * Hours
export const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7;

export const stripTimeOffDate = (date: Date) => {
  return new Date(date.setHours(0, 0, 0, 0));
};

export const isWithin = ({ timeframe, oldDate, newDate }: IsWithinProps) => {
  const oldStripped = stripTimeOffDate(oldDate);
  const newStripped = stripTimeOffDate(newDate);

  switch (timeframe) {
    case "DAY":
      return oldStripped.getTime() === newStripped.getTime();
    case "WEEK":
      return (
        oldStripped.getTime() >= newStripped.getTime() - MILLISECONDS_IN_WEEK
      );
    case "FORTNIGHT":
      return (
        oldStripped.getTime() >=
        newStripped.getTime() - MILLISECONDS_IN_WEEK * 2
      );
    case "MONTH":
      return oldStripped.getMonth() === newStripped.getMonth();
    default:
      return false;
  }
};
