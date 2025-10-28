import Link from "next/link";

const Menu = () => {
  return (
    <nav className="flex gap-4">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        Home
      </Link>
      <Link
        href="/upload"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        Upload
      </Link>
    </nav>
  );
};

export default Menu;
