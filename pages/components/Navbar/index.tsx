import { Button, Dropdown, Menu } from "antd";
import React, { useContext } from "react";
import { AppContext } from "../../context";
import { TypeArea } from "../TypeArea";
import { Container, Content } from "./index.styled";

export const Navbar = () => {
  const { accounts } = useContext(AppContext);
  console.log(accounts);

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
          <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
            <Button>账户信息</Button>
          </Dropdown>
          <Button type="primary">创建项目</Button>
        </Content>
      </TypeArea>
    </Container>
  );
};
