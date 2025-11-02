"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import Header from "@/app/ui/Header";
import BackButton from "../ui/BackButton";
import Loading from "../ui/Loading";
import Error from "../ui/Error";
import NoData from "../ui/NoData";
import { Member } from "../services/types";
import SupervisorCard from "./components/SupervisorCard";
import UnassignedCard, { UNASSIGNED_ID } from "./components/UnassignedCard";

export interface Supervisor {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
  assignees: Member[];
  assigneesCount: number;
  assigneesTotalCP: number;
}

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [unassigned, setUnassigned] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch("/api/supervisors");
      const data = await response.json();
      if (data.success) {
        setSupervisors(data.data);
        setUnassigned(data.unassigned || []);
      }
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  useEffect(() => {
    fetch("/api/supervisors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSupervisors(data.data);
          setUnassigned(data.unassigned || []);
        } else {
          setError(data.error || "Failed to load supervisors");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching supervisors:", error);
        setError("Error loading supervisors");
        setLoading(false);
      });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const assigneeId = active.id as string;
    const targetId = over.id as string;

    // Find the current supervisor (if assigned)
    const currentSupervisor = supervisors.find((s) =>
      s.assignees.some((a) => a._id === assigneeId)
    );

    // Check if it's already unassigned
    const isCurrentlyUnassigned = unassigned.some((a) => a._id === assigneeId);

    // Handle dropping on unassigned zone (remove assignment)
    if (targetId === UNASSIGNED_ID) {
      if (isCurrentlyUnassigned) {
        // Already unassigned, do nothing
        return;
      }

      try {
        const response = await fetch(`/api/members/${assigneeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supervisedBy: null,
          }),
        });

        if (response.ok) {
          await fetchSupervisors();
        } else {
          console.error("Failed to remove supervisor assignment");
          alert("Failed to remove supervisor assignment");
        }
      } catch (error) {
        console.error("Error removing supervisor assignment:", error);
        alert("Error removing supervisor assignment");
      }
      return;
    }

    // Handle dropping on a supervisor (assign or reassign)
    // Don't do anything if dropping on the same supervisor
    if (currentSupervisor?._id === targetId) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${assigneeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supervisedBy: targetId,
        }),
      });

      if (response.ok) {
        // Refresh the supervisors list
        await fetchSupervisors();
      } else {
        console.error("Failed to update supervisor");
        alert("Failed to update supervisor assignment");
      }
    } catch (error) {
      console.error("Error updating supervisor:", error);
      alert("Error updating supervisor assignment");
    }
  };

  if (loading) {
    return <Loading message="Loading supervisors..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 items-baseline">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Supervisors
              </h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Use drag and drop to edit supervisor assignments.
              </span>
            </div>
            <BackButton />
          </div>

          {supervisors.length === 0 ? (
            <NoData message="No supervisors found" />
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-row flex-wrap gap-6 ">
                {supervisors.map((supervisor) => (
                  <SupervisorCard
                    key={supervisor._id}
                    supervisor={supervisor}
                  />
                ))}
                {unassigned.length > 0 && (
                  <UnassignedCard unassigned={unassigned} />
                )}
              </div>
              <DragOverlay>
                {activeId ? (
                  <div className="bg-blue-600 text-white p-3 rounded-md shadow-lg opacity-90">
                    {supervisors
                      .flatMap((s) => s.assignees)
                      .find((a) => a._id === activeId)?.name ||
                      unassigned.find((a) => a._id === activeId)?.name ||
                      "Dragging..."}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
