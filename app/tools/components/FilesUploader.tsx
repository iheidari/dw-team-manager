interface Props {
  value: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilesUploader = (props: Props) => {
  return (
    <div>
      <label
        htmlFor="files"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
      >
        Upload Files
      </label>
      <input
        type="file"
        id="files"
        multiple
        accept="image/*"
        onChange={props.onChange}
        className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
        required
      />
      {props.value.length > 0 && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {props.value.length} file(s) selected
        </p>
      )}
    </div>
  );
};

export default FilesUploader;
