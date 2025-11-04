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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

ModuleRegistry.registerModules([AllCommunityModule]);

const STORAGE_KEY = "member-table-state";

const MemberTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const gridRef = useRef<AgGridReact>(null);
  const filterModelRef = useRef<Record<string, unknown>>({});
  const isGridReady = useRef(false);

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

  const updateSortInUrl = (
    sortModel: Array<{
      colId: string;
      sort: string | null | undefined;
      sortIndex?: number | null | undefined;
    }>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove existing sort params
    params.delete("sortBy");
    params.delete("sortOrder");

    if (sortModel.length > 0) {
      const primarySort = sortModel[0];
      if (primarySort.sort) {
        params.set("sortBy", primarySort.colId);
        params.set("sortOrder", primarySort.sort);
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const saveState = () => {
    if (gridRef.current?.api) {
      const columnState = gridRef.current.api.getColumnState();

      const state = {
        columnState,
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
        .filter((col) => col.sort)
        .map((col) => ({
          colId: col.colId,
          sort: col.sort,
          sortIndex: col.sortIndex,
        }));
      updateSortInUrl(sortModel);
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
        // Load column state and filters from localStorage
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          if (state.columnState) {
            // Restore column state (order and width) but not sort
            const columnStateWithoutSort = state.columnState.map(
              (col: {
                colId: string;
                sort?: string | null;
                [key: string]: unknown;
              }) => ({
                ...col,
                sort: undefined,
              })
            );
            gridRef.current.api.applyColumnState({
              state: columnStateWithoutSort,
              applyOrder: true,
            });
          }
          if (state.filterState) {
            gridRef.current.api.setFilterModel(state.filterState);
          }
        }

        // Apply sort from URL query parameters or use default
        const sortBy = searchParams.get("sortBy");
        const sortOrder = searchParams.get("sortOrder");

        if (sortBy && sortOrder) {
          // Apply sort from URL
          gridRef.current.api.applyColumnState({
            state: [
              {
                colId: sortBy,
                sort: sortOrder as "asc" | "desc",
              },
            ],
            defaultState: { sort: null },
          });
        } else {
          // Apply default sort: Desc on rank
          gridRef.current.api.applyColumnState({
            state: [
              {
                colId: "rank",
                sort: "desc",
              },
            ],
            defaultState: { sort: null },
          });
          // Update URL with default sort
          const params = new URLSearchParams(searchParams.toString());
          params.set("sortBy", "rank");
          params.set("sortOrder", "desc");
          router.replace(`${pathname}?${params.toString()}`);
        }
      } catch (error) {
        console.error("Error loading state:", error);
      }
    }
  };

  const onGridReady = () => {
    isGridReady.current = true;
    loadState();
  };

  // Sync grid sort when URL params change (e.g., browser back/forward)
  useEffect(() => {
    if (isGridReady.current && gridRef.current?.api) {
      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");

      const currentSort = gridRef.current.api
        .getColumnState()
        .find((col) => col.sort);

      // Only update if URL params differ from current grid state
      if (sortBy && sortOrder) {
        if (currentSort?.colId !== sortBy || currentSort?.sort !== sortOrder) {
          gridRef.current.api.applyColumnState({
            state: [
              {
                colId: sortBy,
                sort: sortOrder as "asc" | "desc",
              },
            ],
            defaultState: { sort: null },
          });
        }
      } else if (!sortBy && !sortOrder) {
        // If no sort params, apply default
        if (currentSort?.colId !== "rank" || currentSort?.sort !== "desc") {
          gridRef.current.api.applyColumnState({
            state: [
              {
                colId: "rank",
                sort: "desc",
              },
            ],
            defaultState: { sort: null },
          });
          // Update URL with default sort
          const params = new URLSearchParams(searchParams.toString());
          params.set("sortBy", "rank");
          params.set("sortOrder", "desc");
          router.replace(`${pathname}?${params.toString()}`);
        }
      }
    }
  }, [searchParams, pathname, router]);

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
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ minWidth: "250px" }}
          />
        </div>
        <div>
          <Link
            href="/member"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add New Member
          </Link>
        </div>
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
