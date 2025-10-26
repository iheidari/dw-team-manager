interface FieldProps {
  label: string;
  value: string | number;
}

const Field = ({ label, value }: FieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default Field;
