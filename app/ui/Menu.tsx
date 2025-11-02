import Link from "next/link";

const menuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Formation",
    href: "/formation",
  },
  {
    label: "Supervisors",
    href: "/supervisors",
  },

  // {
  //   label: "Upload",
  //   href: "/upload",
  // },
];

const Menu = () => {
  return (
    <nav className="flex gap-4">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
