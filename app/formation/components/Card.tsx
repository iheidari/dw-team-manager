import { Member } from "@/app/services/types";

type Props = {
  member?: Member;
};

const Card = (props: Props) => {
  const { member } = props;
  if (!member) {
    return (
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center p-4">
        <span className="text-zinc-400 dark:text-zinc-600">—</span>
      </div>
    );
  }
  if (!member.location) {
    return (
      <span
        key={member._id}
        className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-zinc-900 dark:text-white text-sm"
      >
        {member.name}
      </span>
    );
  }
  return (
    <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center p-4">
      <span className="text-center font-medium text-zinc-900 dark:text-white text-sm sm:text-base">
        {member.name}
      </span>
    </div>
  );
};

export default Card;
