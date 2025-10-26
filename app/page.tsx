import MemberTable from "./components/MemberTable";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
            KT Team Manager
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your team&apos;s performance and stats
          </p>
        </div>

        <MemberTable />
      </main>
    </div>
  );
}
