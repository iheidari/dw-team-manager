"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
    >
      ← Back
    </button>
  );
};

export default BackButton;
