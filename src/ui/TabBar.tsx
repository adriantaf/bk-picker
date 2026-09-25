import { Tabs } from "@mantine/core";
import type { AppTab } from "@/types";

type TabBarProps = {
  value: AppTab;
  onChange: (tab: AppTab) => void;
  labels: Record<AppTab, string>;
};

const TABS: AppTab[] = ["picker", "history", "palettes", "systems", "settings"];

export function TabBar({ value, onChange, labels }: TabBarProps) {
  return (
    <Tabs
      value={value}
      onChange={(next) => {
        if (next) onChange(next as AppTab);
      }}
      variant="pills"
      radius="md"
    >
      <Tabs.List grow style={{ flexWrap: "wrap", gap: 4 }}>
        {TABS.map((tab) => (
          <Tabs.Tab
            key={tab}
            value={tab}
            style={{ flex: "1 1 auto", minWidth: 0, fontSize: 11, paddingInline: 6 }}
          >
            {labels[tab]}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
