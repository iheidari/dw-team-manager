import { Member } from "../services/types";

export type HeatMap = "" | "kills" | "cp" | "wt";

const HEAT_MAP = {
  10: "bg-red-600",
  9: "bg-red-500",
  8: "bg-red-400",
  7: "bg-red-300",
  6: "bg-red-100",
  5: "bg-blue-100",
  4: "bg-blue-200",
  3: "bg-blue-300",
  2: "bg-blue-400",
  1: "bg-blue-500",
  0: "bg-blue-600",
};

const WT_HEAT_MAP = {
  Ind6: 10,
  Ind5: 9,
  Ind4: 8,
  Ind3: 7,
  Ind2: 6,
  Ind1: 5,
  "30": 4,
  "29": 3,
  "28": 2,
  "27": 1,
  "26": 1,
  "25": 0,
};

export const getHeatmapClass = (
  heatmap: HeatMap,
  member?: Member,
  members?: Member[]
) => {
  if (!member) {
    return "";
  }
  if (heatmap === "kills") {
    const kills = members?.map((m) => m.kills) ?? [];
    const killPercentage = getSpectrom(member.kills, kills);
    return HEAT_MAP[killPercentage as keyof typeof HEAT_MAP];
  }
  if (heatmap === "cp") {
    const cp = members?.map((m) => m.cp) ?? [];
    const cpPercentage = getSpectrom(member.cp, cp);
    return HEAT_MAP[cpPercentage as keyof typeof HEAT_MAP];
    return "";
  }
  if (heatmap === "wt") {
    const result =
      HEAT_MAP[
        WT_HEAT_MAP[
          member.level as keyof typeof WT_HEAT_MAP
        ] as keyof typeof HEAT_MAP
      ];
    return result ?? "";
  }

  return "";
};

export const getSpectrom = (value: number, values: number[]) => {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  // Find first index where sorted[index] >= value
  let idx = sorted.findIndex((v) => v >= value);

  // If value is higher than all, use last index
  if (idx === -1) idx = sorted.length - 1;

  // Calculate the percentile position [0..1]
  const percentile = sorted.length === 1 ? 1 : idx / (sorted.length - 1);

  // Map to a 0-9 integer bin, ensure in range 0-9
  return Math.min(9, Math.max(0, Math.floor(percentile * 10)));
};
