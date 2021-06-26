import React from "react";
import { TabsContainer } from "./tabs.styled";

const { TabPane } = TabsContainer;

interface IProps {
  value: TabListProps.Value;
  onChange: (v: TabListProps.Value) => void;
}

export const Tabs = ({ value, onChange }: IProps) => {
  const list: TabListProps.TabsProps = [
    {
      label: "所有项目",
      value: "All",
    },
    {
      label: "已投资",
      value: "Invested",
    },
    {
      label: "我创建的",
      value: "Create",
    },
  ];

  return (
    <TabsContainer activeKey={value} onChange={onChange} tabPosition="left">
      {list.map((v) => (
        <TabPane tab={v.label} key={v.value} />
      ))}
    </TabsContainer>
  );
};
