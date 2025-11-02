import { ColDef, ValueFormatterParams } from "ag-grid-community";

export interface RowData {
  _id: string;
  name: string;
  rank: "R1" | "R2" | "R3" | "R4" | "R5";
  level:
    | "Ind1"
    | "Ind2"
    | "Ind3"
    | "Ind4"
    | "Ind5"
    | "Ind6"
    | "30"
    | "29"
    | "28"
    | "27"
    | "26"
    | "25";
  kills: number;
  cp: number;
  location?: {
    row: number;
    col: number;
  };
  supervisedByName?: string | null;
}

// Format number with comma separators
const numberFormatter = (params: ValueFormatterParams) => {
  if (params.value == null) {
    return "";
  }
  return params.value.toLocaleString("en-US");
};

export const columnDefs: ColDef<RowData>[] = [
  { field: "name", headerName: "Name", flex: 1, filter: true },
  {
    field: "rank",
    headerName: "Rank",
    flex: 1,
    filter: true,
  },
  {
    field: "level",
    headerName: "Watch Tower",
    flex: 1,
    filter: true,
    cellDataType: "text",
  },
  {
    field: "kills",
    headerName: "Kills",
    flex: 1,
    filter: true,
    cellDataType: "number",
    valueFormatter: numberFormatter,
  },
  {
    field: "cp",
    headerName: "CP",
    flex: 1,
    filter: true,
    cellDataType: "number",
    valueFormatter: numberFormatter,
  },
  {
    field: "supervisedByName",
    headerName: "Supervisor",
    flex: 1,
    filter: true,
    valueFormatter: (params: ValueFormatterParams) => {
      return params.value || "-";
    },
  },
];
