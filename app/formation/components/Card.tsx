"use client";

import { Member } from "@/app/services/types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import MemberCard from "./MemberCard";

type Props = {
  member?: Member;
  row?: number;
  col?: number;
  isUnpositionedArea?: boolean;
};

const Card = (props: Props) => {
  const { member, row, col, isUnpositionedArea } = props;
  const draggableId = member
    ? `${member._id}-${
        row !== undefined && col !== undefined
          ? `${row}-${col}`
          : "unpositioned"
      }`
    : isUnpositionedArea
    ? "unpositioned-area"
    : `empty-${row}-${col}`;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
      data: {
        member,
        row,
        col,
        isUnpositionedArea,
      },
    });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: draggableId,
    data: {
      member,
      row,
      col,
      isUnpositionedArea,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // For unpositioned area container (not draggable, only droppable)
  if (isUnpositionedArea) {
    return (
      <div
        ref={setDroppableRef}
        className={`p-4 rounded-lg border-2 border-dashed ${
          isOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
        data-row=""
        data-col=""
      >
        <span className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white block">
          Members without position
        </span>
      </div>
    );
  }

  if (!member) {
    const combinedRef = (element: HTMLElement | null) => {
      setNodeRef(element);
      setDroppableRef(element);
    };

    return (
      <div
        ref={combinedRef}
        style={style}
        className={`aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 ${
          isOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 dark:border-zinc-700"
        } rounded-lg flex items-center justify-center p-4 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <span className="text-zinc-400 dark:text-zinc-600">—</span>
      </div>
    );
  }

  if (!member.location && row === undefined && col === undefined) {
    const combinedRef = (element: HTMLElement | null) => {
      setNodeRef(element);
      setDroppableRef(element);
    };

    return (
      <div
        ref={combinedRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 ${
          isOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 dark:border-zinc-700"
        } rounded-lg flex items-center justify-center p-4 cursor-grab active:cursor-grabbing ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <MemberCard name={member.name} kills={member.kills} cp={member.cp} />
      </div>
    );
  }

  const combinedRef = (element: HTMLElement | null) => {
    setNodeRef(element);
    setDroppableRef(element);
  };

  return (
    <div
      ref={combinedRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 ${
        isOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-zinc-300 dark:border-zinc-700"
      } rounded-lg flex items-center justify-center p-4 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <MemberCard name={member.name} kills={member.kills} cp={member.cp} />
    </div>
  );
};

export default Card;
