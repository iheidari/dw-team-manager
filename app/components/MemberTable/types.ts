import { ColDef } from "ag-grid-community";

export interface RowData {
  _id: string;
  name: string;
  rank: string; // "R1" | "R2" | "R3" | "R4" | "R5";
  level: string;
  // | "Ind1"
  // | "Ind2"
  // | "Ind3"
  // | "Ind4"
  // | "Ind5"
  // | "Ind6"
  // | "30"
  // | "29"
  // | "28"
  // | "27"
  // | "26"
  // | "25";
  kills: number;
  cp: number;
  location?: {
    row: number;
    col: number;
  };
}

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
    headerName: "Level",
    flex: 1,
    filter: true,
  },
  {
    field: "kills",
    headerName: "Kills",
    flex: 1,
    filter: true,
    comparator: (valueA: number, valueB: number) => {
      return valueA - valueB;
    },
    // cellDataType: "number",
  },
  {
    field: "cp",
    headerName: "CP",
    flex: 1,
    filter: true,
    comparator: (valueA: number, valueB: number) => {
      return valueA - valueB;
    },
    // cellDataType: "number",
  },
];
