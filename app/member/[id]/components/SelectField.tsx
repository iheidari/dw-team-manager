interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: SelectFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-lg font-semibold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
