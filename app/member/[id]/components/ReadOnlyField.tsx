import { ReactNode } from "react";

interface ReadOnlyFieldProps {
  label: string;
  name: string;
  value: string | null;
  hint?: ReactNode;
}

const ReadOnlyField = ({ label, name, value, hint }: ReadOnlyFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value || ""}
        readOnly
        disabled
        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-lg font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed opacity-70"
      />
      {hint && (
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </div>
      )}
    </div>
  );
};

export default ReadOnlyField;
