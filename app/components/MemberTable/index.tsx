"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  RowClickedEvent,
} from "ag-grid-community";
import { columnDefs, RowData } from "./types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

ModuleRegistry.registerModules([AllCommunityModule]);

const MemberTable = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRowData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });
  }, []);

  const onRowClicked = (event: RowClickedEvent<RowData>) => {
    if (event.data) {
      const memberId = event.data._id;
      router.push(`/members/${memberId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-zinc-600 dark:text-zinc-400">Loading members...</p>
      </div>
    );
  }

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
        onRowClicked={onRowClicked}
        className="cursor-pointer"
      />
    </div>
  );
};

export default MemberTable;
