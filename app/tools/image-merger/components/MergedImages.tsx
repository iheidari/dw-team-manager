interface MergedImagesProps {
  images: string[];
}

export default function MergedImages({ images }: MergedImagesProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
        Merged Images ({images.length})
      </h3>
      <div className="flex flex-row gap-4 flex-wrap">
        {images.map((imageBase64, index) => (
          <div
            key={index}
            className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900 shrink-0"
          >
            <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Image {index + 1}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt={`Merged image ${index + 1}`}
              className="max-w-full max-h-[400px] h-auto rounded-lg shadow-md object-contain"
            />
            <div className="mt-2">
              <a
                href={`data:image/png;base64,${imageBase64}`}
                download={`merged-image-${index + 1}.png`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
