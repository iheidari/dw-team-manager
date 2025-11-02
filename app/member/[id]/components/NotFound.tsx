import Header from "@/app/ui/Header";
import BackButton from "@/app/ui/BackButton";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="flex flex-col items-center justify-center w-full mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Member Not Found
          </h2>
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
