export const rangesOverlapSafe = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean => !(aEnd < bStart || bEnd < aStart);
