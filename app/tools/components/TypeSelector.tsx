interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TypeSelector = (props: Props) => {
  return (
    <div>
      <label
        htmlFor="type"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
      >
        Select Type
      </label>
      <select
        id="type"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Choose a type...</option>
        <option value="kills">Kills</option>
      </select>
    </div>
  );
};

export default TypeSelector;
