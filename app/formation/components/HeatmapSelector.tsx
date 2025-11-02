import SelectField from "@/app/member/[id]/components/SelectField";
import { HeatMap } from "../service";

interface Props {
  value: string;
  onChange: (value: HeatMap) => void;
}

const HEATMAP_OPTIONS: { label: string; value: HeatMap }[] = [
  { label: "Choose a heatmap...", value: "" },
  { label: "Kills", value: "kills" },
  { label: "CP", value: "cp" },
  { label: "WT", value: "wt" },
];
const HeatmapSelector = (props: Props) => {
  return (
    <SelectField
      name="heatmap"
      value={props.value}
      onChange={(value) => props.onChange(value as HeatMap)}
      options={HEATMAP_OPTIONS}
    />
  );
};

export default HeatmapSelector;
