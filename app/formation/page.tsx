import Header from "../components/Header";

export default function Formation() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
            Formation
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Configure your team formation and tactics
          </p>
        </div>
      </main>
    </div>
  );
}
