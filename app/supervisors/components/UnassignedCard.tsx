import { useDroppable } from "@dnd-kit/core";
import Assignee from "./Assignee";
import { Member } from "@/app/services/types";
import { formatNumberShort } from "@/app/services/numbers";
import NoAssignee from "./NoAssignee";

type Props = {
  unassigned: Member[];
};

const UNASSIGNED_ID = "unassigned";

const UnassignedCard = (props: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: UNASSIGNED_ID,
  });

  const assignees = props.unassigned.toSorted((a, b) => b.cp - a.cp);
  const totalCP = assignees.reduce((sum, assignee) => sum + assignee.cp, 0);

  return (
    <div
      ref={setNodeRef}
      className={`w-52 transition-colors ${
        isOver
          ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 rounded-lg p-2"
          : ""
      }`}
    >
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        Unassigned
      </h3>

      <div className="flex flex-col gap-2">
        <div className="border-2 p-3 rounded-md">
          Total CP: {formatNumberShort(totalCP)}
        </div>
        {assignees.map((assignee) => (
          <Assignee key={assignee._id} assignee={assignee} />
        ))}
      </div>
    </div>
  );
};

export default UnassignedCard;
export { UNASSIGNED_ID };
