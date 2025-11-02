import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { formatNumberShort } from "@/app/services/numbers";
import { Member } from "@/app/services/types";
import Link from "next/link";

type Props = {
  assignee: Member;
};

const Assignee = (props: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.assignee._id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <span
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-2 p-3 rounded-md block"
        onClick={(e) => {
          // Prevent navigation when dragging
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {props.assignee.name} ({formatNumberShort(props.assignee.cp)})
      </span>
    </div>
  );
};

export default Assignee;
