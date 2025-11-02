export const formatNumberShort = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, "") + "B";
  }
  if (num >= 10_000_000) {
    return (num / 1000000).toFixed(0).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000_000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
};
