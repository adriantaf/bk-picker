import { SegmentedControl } from "@mantine/core";
import type { AppTab } from "@/types";

type TabBarProps = {
  value: AppTab;
  onChange: (tab: AppTab) => void;
  labels: Record<AppTab, string>;
};

const TABS: AppTab[] = ["workspace", "history", "settings"];

export function TabBar({ value, onChange, labels }: TabBarProps) {
  return (
    <SegmentedControl
      fullWidth
      value={value}
      onChange={(next) => {
        if (next) onChange(next as AppTab);
      }}
      data={TABS.map((tab) => ({
        value: tab,
        label: labels[tab],
      }))}
      radius="md"
    />
  );
}
