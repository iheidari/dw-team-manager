import Menu from "./Menu";

const Header = () => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          KT Team Manager
        </h1>
        <Menu />
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">
        Manage your team&apos;s performance and stats
      </p>
    </div>
  );
};

export default Header;
