export const TIMES_TO_COMPLETE_MAX = 10;
export const timesToCompleteItems = Array.from(
  { length: TIMES_TO_COMPLETE_MAX },
  (_, i) => i + 1,
);
