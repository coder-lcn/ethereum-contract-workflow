import { Tabs } from "antd";
import styled from "styled-components";

export const TabsContainer = styled(Tabs)`
  position: fixed;
  left: 0;
  top: 60px;

  .ant-tabs-nav {
    margin-top: 30px;
    margin-bottom: 60px;
  }
`;
