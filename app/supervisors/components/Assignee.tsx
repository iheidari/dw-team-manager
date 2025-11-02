import { formatNumberShort } from "@/app/services/numbers";
import { Member } from "@/app/services/types";
import Link from "next/link";

type Props = {
  assignee: Member;
};

const Assignee = (props: Props) => {
  return (
    <Link
      key={props.assignee._id}
      href={`/member/${props.assignee._id}`}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline border-2 p-3 rounded-md"
    >
      {props.assignee.name} ({formatNumberShort(props.assignee.cp)})
    </Link>
  );
};

export default Assignee;
