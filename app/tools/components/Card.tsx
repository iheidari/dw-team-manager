import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  description: string;
  href: string;
};

const Card = (props: Props) => {
  const { title, description, href } = props;
  return (
    <Link href={href} className="block">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-md w-[200px] aspect-square flex flex-col justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-zinc-50 dark:hover:bg-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default Card;
