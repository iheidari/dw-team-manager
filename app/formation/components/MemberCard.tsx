import { formatNumberShort } from "@/app/services/numbers";

interface Props {
  name: string;
  kills: number;
  cp: number;
}

const MemberCard = (props: Props) => {
  return (
    <div className="text-center pointer-events-none">
      <div className="font-medium text-zinc-900 dark:text-white text-sm sm:text-base bg-gray-700/50 p-1 rounded-md">
        {props.name}
      </div>
      <div className="text-xs text-zinc-900 dark:text-white mt-2 bg-gray-400/50 p-1 rounded-md">
        ☠️{formatNumberShort(props.kills)} • ⚡{formatNumberShort(props.cp)}
      </div>
    </div>
  );
};

export default MemberCard;
