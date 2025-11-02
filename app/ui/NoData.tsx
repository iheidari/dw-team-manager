import React from "react";

type Props = {
  message: string;
};

const NoData = (props: Props) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center">
      <p className="text-zinc-600 dark:text-zinc-400">{props.message}</p>
    </div>
  );
};

export default NoData;
