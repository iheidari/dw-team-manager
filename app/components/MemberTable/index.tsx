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
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

ModuleRegistry.registerModules([AllCommunityModule]);

const STORAGE_KEY = "member-table-state";

const MemberTable = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const gridRef = useRef<AgGridReact>(null);
  const sortModelRef = useRef<
    Array<{
      colId: string;
      sort: string | null | undefined;
      sortIndex?: number | null | undefined;
    }>
  >([]);
  const filterModelRef = useRef<Record<string, unknown>>({});

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

  const saveState = () => {
    if (gridRef.current?.api) {
      const columnState = gridRef.current.api.getColumnState();

      const state = {
        columnState,
        sortState: sortModelRef.current,
        filterState: filterModelRef.current,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  const onSortChanged = () => {
    if (gridRef.current?.api) {
      const sortModel = gridRef.current.api
        .getColumnState()
        .filter((col) => col.sort);
      sortModelRef.current = sortModel.map((col) => ({
        colId: col.colId,
        sort: col.sort,
        sortIndex: col.sortIndex,
      }));
      saveState();
    }
  };

  const onFilterChanged = () => {
    if (gridRef.current?.api) {
      filterModelRef.current = gridRef.current.api.getFilterModel();
      saveState();
    }
  };

  const loadState = () => {
    if (gridRef.current?.api) {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          if (state.columnState) {
            // Restore column state which includes order, width, and sort
            gridRef.current.api.applyColumnState({
              state: state.columnState,
              applyOrder: true,
            });
          }
          if (state.filterState) {
            gridRef.current.api.setFilterModel(state.filterState);
          }
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
  };

  const onGridReady = () => {
    loadState();
  };

  const onRowClicked = (event: RowClickedEvent<RowData>) => {
    if (event.data) {
      const memberId = event.data._id;
      router.push(`/member/${memberId}`);
    }
  };

  // Throttled search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gridRef.current?.api) {
        if (searchText) {
          gridRef.current.api.setFilterModel({
            name: {
              type: "contains",
              filter: searchText,
            },
          });
        } else {
          // Clear the name filter if search is empty
          const currentFilterModel = gridRef.current.api.getFilterModel() || {};
          delete currentFilterModel.name;
          gridRef.current.api.setFilterModel(currentFilterModel);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-zinc-600 dark:text-zinc-400">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ minWidth: "250px" }}
        />
      </div>
      <div className="ag-theme-quartz w-full" style={{ height: "500px" }}>
        <AgGridReact<RowData>
          ref={gridRef}
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
          onRowClicked={onRowClicked}
          onGridReady={onGridReady}
          onColumnMoved={saveState}
          onColumnResized={saveState}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MemberTable;
