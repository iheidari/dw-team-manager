import { ColDef } from "ag-grid-community";

export interface RowData {
  name: string;
  rank: "R1" | "R2" | "R3" | "R4" | "R5";
  level: "Ind1" | "Ind2" | "Ind3" | "Ind4" | "Ind5" | "Ind6";
  kills: number;
  cp: number;
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
  { field: "kills", headerName: "Kills", flex: 1, filter: true },
  { field: "cp", headerName: "CP", flex: 1, filter: true },
];

export const rowData: RowData[] = [
  { name: "Alice", rank: "R5", level: "Ind6", kills: 450, cp: 1200 },
  { name: "Bob", rank: "R3", level: "Ind4", kills: 230, cp: 850 },
  { name: "Charlie", rank: "R4", level: "Ind5", kills: 320, cp: 950 },
  { name: "Diana", rank: "R2", level: "Ind2", kills: 150, cp: 500 },
  { name: "Eve", rank: "R1", level: "Ind1", kills: 50, cp: 200 },
];
