"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { columnDefs, RowData } from "./types";
import { rowData } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

const MemberTable = () => {
  return (
    <div className="ag-theme-quartz w-full" style={{ height: "500px" }}>
      <AgGridReact<RowData>
        theme="legacy"
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{
          flex: 1,
          sortable: true,
          filter: true,
          resizable: true,
        }}
        enableCellTextSelection={true}
        suppressCellFocus={false}
        rowSelection="multiple"
      />
    </div>
  );
};

export default MemberTable;
