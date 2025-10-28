interface FieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
}

const Field = ({ label, name, value, onChange }: FieldProps) => {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-lg font-semibold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default Field;
