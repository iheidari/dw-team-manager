"use client";
import { useState } from "react";
import Header from "@/app/ui/Header";
import FilesUploader from "@/app/tools/components/FilesUploader";
import MergedImages from "./components/MergedImages";
import CropParameters, { CropValues } from "./components/CropParameters";

export default function ImageMerger() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [number, setNumber] = useState<string>("");
  const [crop, setCrop] = useState<CropValues>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedImages, setMergedImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setError(null);
      setMergedImages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMergedImages([]);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("number", number);

      // Add crop parameter if any crop values are provided
      const hasCropValues =
        crop.top !== undefined ||
        crop.bottom !== undefined ||
        crop.left !== undefined ||
        crop.right !== undefined;
      if (hasCropValues) {
        formData.append("crop", JSON.stringify(crop));
      }

      const response = await fetch("/api/image-merge", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "Failed to merge images";
        setError(errorMessage);
        return;
      }

      setMergedImages(result.data.images);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
            Image Merger
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mb-6 text-zinc-600 dark:text-zinc-400">
              Merging images...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FilesUploader value={selectedFiles} onChange={handleFileChange} />

            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Number
              </label>
              <input
                type="number"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>

            <CropParameters value={crop} onChange={setCrop} />

            <button
              type="submit"
              disabled={loading || selectedFiles.length === 0}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Merging..." : "Submit"}
            </button>
          </form>

          <MergedImages images={mergedImages} />
        </div>
      </main>
    </div>
  );
}
