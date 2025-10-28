interface Props {
  name: string;
  kills: number;
  cp: number;
}

const formatNumber = (num: number): string => {
  if (num >= 10_000_000) {
    return (num / 1000000).toFixed(0).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000_000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
};

const MemberCard = (props: Props) => {
  return (
    <div className="text-center pointer-events-none">
      <div className="font-medium text-zinc-900 dark:text-white text-sm sm:text-base">
        {props.name}
      </div>
      <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
        ☠️{formatNumber(props.kills)} • ⚡{formatNumber(props.cp)}
      </div>
    </div>
  );
};

export default MemberCard;
