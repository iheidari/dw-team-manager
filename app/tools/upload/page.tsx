"use client";
import { useState } from "react";
import Header from "@/app/ui/Header";
import TypeSelector from "@/app/tools/components/TypeSelector";
import FilesUploader from "@/app/tools/components/FilesUploader";

export default function Upload() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Type:", selectedType);
    console.log("Files:", selectedFiles);
    // TODO: Implement actual upload logic
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
            Upload
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TypeSelector value={selectedType} onChange={setSelectedType} />
            <FilesUploader value={selectedFiles} onChange={handleFileChange} />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
