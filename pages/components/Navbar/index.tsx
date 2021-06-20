import { Button, Dropdown, Menu } from "antd";
import React, { useContext, useState } from "react";
import { AppContext, ProjectContext } from "../../context";
import { CreateProject } from "../CreateProject";
import { TypeArea } from "../TypeArea";
import { Container, Content } from "./index.styled";

export const Navbar = () => {
  const { state } = useContext(ProjectContext);
  const { accounts } = useContext(AppContext);
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu>
      {accounts.map((item) => {
        return (
          <Menu.Item key={item.account}>
            <span>{item.account}：</span>
            <span>{item.eth} ETH</span>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <Container>
      <TypeArea>
        <Content>
          {accounts.length ? (
            <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
              <Button>账户信息</Button>
            </Dropdown>
          ) : (
            <Button onClick={() => window.ethereum.enable()}>连接钱包</Button>
          )}
          <Button type="primary" onClick={() => setVisible(true)} loading={state.type === "createing"}>
            创建项目
          </Button>
        </Content>
      </TypeArea>
      <CreateProject visible={visible} setVisible={setVisible} />
    </Container>
  );
};
