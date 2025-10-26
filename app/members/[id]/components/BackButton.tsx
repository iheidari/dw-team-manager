import Link from "next/link";

const BackButton = () => {
  return (
    <Link
      href="/"
      className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
    >
      ← Back to Team
    </Link>
  );
};

export default BackButton;
