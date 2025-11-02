import { useDroppable } from "@dnd-kit/core";
import NoAssignee from "./NoAssignee";
import Assignee from "./Assignee";
import { Supervisor } from "../page";
import { formatNumberShort } from "@/app/services/numbers";

type Props = {
  supervisor: Supervisor;
};

const SupervisorCard = (props: Props) => {
  const assignees = props.supervisor.assignees.toSorted((a, b) => b.cp - a.cp);
  const totalCP = assignees.reduce((sum, assignee) => sum + assignee.cp, 0);

  const { setNodeRef, isOver } = useDroppable({
    id: props.supervisor._id,
  });

  return (
    <div
      ref={setNodeRef}
      key={props.supervisor._id}
      className={`w-52 transition-colors ${
        isOver
          ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg p-2"
          : ""
      }`}
    >
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        {props.supervisor.name}
      </h3>
      {assignees.length === 0 ? (
        <NoAssignee />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="border-2 p-3 rounded-md">
            Total CP: {formatNumberShort(totalCP)}
          </div>
          {assignees.map((assignee) => (
            <Assignee key={assignee._id} assignee={assignee} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupervisorCard;
