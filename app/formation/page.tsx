"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent } from "@dnd-kit/core";
import { Member } from "../services/types";
import Loading from "../ui/Loading";
import Card from "./components/Card";
import BackButton from "../ui/BackButton";
import HeatmapSelector from "./components/HeatmapSelector";
import { getHeatmapClass, HeatMap } from "./service";
import { useRouter } from "next/navigation";

export default function Formation() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridConfig, setGridConfig] = useState({ rows: 1, cols: 1 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<HeatMap>("");

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const membersData = data.data as Member[];
          setMembers(membersData);

          // Calculate grid dimensions based on member locations
          const maxRow = Math.max(
            ...membersData
              .filter((m) => m.location)
              .map((m) => m.location!.row),
            0
          );
          const maxCol = Math.max(
            ...membersData
              .filter((m) => m.location)
              .map((m) => m.location!.col),
            0
          );

          setGridConfig({
            rows: maxRow + 1,
            cols: maxCol + 1,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });
  }, []);

  const getMemberAtPosition = (
    row: number,
    col: number
  ): Member | undefined => {
    return members.find(
      (member) => member.location?.row === row && member.location?.col === col
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current as {
      member?: Member;
      row?: number;
      col?: number;
      isUnpositionedArea?: boolean;
    };
    const overData = over.data.current as {
      row?: number;
      col?: number;
      isUnpositionedArea?: boolean;
    };

    if (!activeData.member) return;

    // Handle drop on the unpositioned area
    if (overData.isUnpositionedArea || over.id === "unpositioned-area") {
      // Remove location from member
      const updatedMembers = members.map((m) =>
        m._id === activeData.member!._id ? { ...m, location: undefined } : m
      );
      setMembers(updatedMembers);

      try {
        await fetch(`/api/members/${activeData.member._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: null }),
        });
      } catch (error) {
        console.error("Error updating member:", error);
      }
      return;
    }

    const targetRow = overData.row;
    const targetCol = overData.col;

    if (targetRow === undefined || targetCol === undefined) return;

    // Check if target position has a member
    const existingMember = getMemberAtPosition(targetRow, targetCol);

    // If same position, do nothing
    if (
      activeData.member.location?.row === targetRow &&
      activeData.member.location?.col === targetCol
    ) {
      return;
    }

    // Swap logic
    let updatedMembers = [...members];

    if (existingMember && activeData.member._id !== existingMember._id) {
      // Swap members
      if (activeData.member.location) {
        existingMember.location = activeData.member.location;
      } else {
        existingMember.location = undefined;
      }
      updatedMembers = updatedMembers.map((m) => {
        if (m._id === existingMember._id) {
          return existingMember;
        }
        return m;
      });
    } else if (existingMember && activeData.member._id === existingMember._id) {
      // Dragging onto itself
      return;
    }

    // Update the active member's position
    updatedMembers = updatedMembers.map((m) =>
      m._id === activeData.member!._id
        ? { ...m, location: { row: targetRow, col: targetCol } }
        : m
    );

    setMembers(updatedMembers);

    // Update database
    try {
      await fetch(`/api/members/${activeData.member._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: { row: targetRow, col: targetCol } }),
      });
    } catch (error) {
      console.error("Error updating member:", error);
    }

    // If we swapped, also update the swapped member
    if (existingMember && activeData.member._id !== existingMember._id) {
      try {
        await fetch(`/api/members/${existingMember._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: existingMember.location }),
        });
      } catch (error) {
        console.error("Error updating swapped member:", error);
      }
    }
  };

  const handleHeatmapChange = (value: HeatMap) => {
    setHeatmap(value);
  };

  if (loading) {
    return <Loading message="Loading formation..." />;
  }

  return (
    <>
      <div className="flex w-full  justify-between items-center pt-8 px-8 bg-white dark:bg-black sm:items-start">
        <BackButton />
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/formation/print")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Print
          </button>
          <HeatmapSelector value={heatmap} onChange={handleHeatmapChange} />
        </div>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="flex  w-full  flex-col items-center bg-white dark:bg-black sm:items-start">
          <div className="w-full mt-4">
            <div className="overflow-x-auto mb-4">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${gridConfig.cols + 2}, 150px)`,
                }}
              >
                {Array.from({
                  length: (gridConfig.rows + 2) * (gridConfig.cols + 2),
                }).map((_, index) => {
                  const row = Math.floor(index / (gridConfig.cols + 2)) - 1;
                  const col = (index % (gridConfig.cols + 2)) - 1;
                  const member = getMemberAtPosition(row, col);

                  return (
                    <Card
                      key={index}
                      member={member}
                      row={row}
                      col={col}
                      className={getHeatmapClass(heatmap, member, members)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <Card isUnpositionedArea />
              <div className="flex flex-wrap gap-2 mt-4">
                {members
                  .filter((m) => !m.location)
                  .map((member) => (
                    <Card
                      key={member._id}
                      member={member}
                      className={getHeatmapClass(heatmap, member, members)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </main>
        <DragOverlay>
          {activeId ? (
            <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center p-4 opacity-90 shadow-lg">
              <span className="text-center font-medium text-zinc-900 dark:text-white text-sm sm:text-base">
                {(activeId as string).includes("empty")
                  ? "—"
                  : members.find((m) => activeId.includes(m._id))?.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
