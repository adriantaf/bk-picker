import { Tabs } from "@mantine/core";
import type { AppTab } from "@/types";

type TabBarProps = {
  value: AppTab;
  onChange: (tab: AppTab) => void;
  labels: Record<AppTab, string>;
};

const TABS: AppTab[] = ["color", "image", "settings"];

export function TabBar({ value, onChange, labels }: TabBarProps) {
  return (
    <Tabs
      value={value}
      onChange={(next) => {
        if (next) onChange(next as AppTab);
      }}
      variant="default"
    >
      <Tabs.List
        grow
        style={{
          flexWrap: "nowrap",
          gap: 0,
          borderBottom: "none",
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Tab
            key={tab}
            value={tab}
            styles={{
              tab: {
                fontSize: 14,
                fontWeight: 500,
                paddingInline: 12,
                paddingBlock: 12,
                color: "var(--color-muted)",
              },
            }}
          >
            {labels[tab]}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
