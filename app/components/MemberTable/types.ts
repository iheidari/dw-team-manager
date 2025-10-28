import { ColDef } from "ag-grid-community";

export interface RowData {
  _id: string;
  name: string;
  rank: "R1" | "R2" | "R3" | "R4" | "R5";
  level: "Ind1" | "Ind2" | "Ind3" | "Ind4" | "Ind5" | "Ind6";
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
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["R1", "R2", "R3", "R4", "R5"],
    },
  },
  {
    field: "level",
    headerName: "Level",
    flex: 1,
    filter: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Ind1", "Ind2", "Ind3", "Ind4", "Ind5", "Ind6"],
    },
  },
  {
    field: "kills",
    headerName: "Kills",
    flex: 1,
    filter: true,
    type: "number",
    comparator: (valueA: number, valueB: number) => {
      return valueA - valueB;
    },
  },
  {
    field: "cp",
    headerName: "CP",
    flex: 1,
    filter: true,
    type: "number",
    comparator: (valueA: number, valueB: number) => {
      return valueA - valueB;
    },
  },
];
