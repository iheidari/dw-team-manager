"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  goHome?: boolean;
}

const BackButton = ({ goHome = false }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => (goHome ? router.push("/") : router.back())}
      className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
    >
      ← Back
    </button>
  );
};

export default BackButton;
