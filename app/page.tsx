import Header from "./ui/Header";
import MemberTable from "./ui/MemberTable";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <MemberTable />
      </main>
    </div>
  );
}
