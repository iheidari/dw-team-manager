type Props = {
  message?: string;
};

const NoAssignee = (props: Props) => {
  return (
    <p className="text-zinc-500 dark:text-zinc-400 italic">
      {props.message || "Nothing here"}
    </p>
  );
};

export default NoAssignee;
