export interface CropValues {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface CropParametersProps {
  value: CropValues;
  onChange: (crop: CropValues) => void;
}

export default function CropParameters({
  value,
  onChange,
}: CropParametersProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Crop (Optional - pixels to remove from each side)
      </label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="crop-top"
            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Top
          </label>
          <input
            type="number"
            id="crop-top"
            value={value.top ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                top: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="crop-bottom"
            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Bottom
          </label>
          <input
            type="number"
            id="crop-bottom"
            value={value.bottom ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                bottom: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="crop-left"
            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Left
          </label>
          <input
            type="number"
            id="crop-left"
            value={value.left ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                left: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="crop-right"
            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Right
          </label>
          <input
            type="number"
            id="crop-right"
            value={value.right ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                right: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
