import Header from "@/app/ui/Header";

interface Props {
  message: string;
}
const Loading = (props: Props) => {
  const { message } = props;
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>
      </main>
    </div>
  );
};

export default Loading;
