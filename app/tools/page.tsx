import Header from "@/app/ui/Header";
import Card from "./components/Card";

const TOOLS = [
  {
    title: "Image merger",
    description: "make a few images from multiple images",
    href: "/tools/image-merger",
  },
  {
    title: "Upload",
    description: "Upload a file to the server",
    href: "/tools/upload",
  },
];

export default function Upload() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
            Tools
          </h2>

          <div className="flex flex-wrap gap-6">
            {TOOLS.map((tool) => (
              <Card key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
