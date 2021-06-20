import { Card, Progress, Spin } from "antd";
import BigNumber from "bignumber.js";
import web3 from "lib/web3";
import { ProjectContext } from "pages/context";
import { useProjectList } from "pages/hooks/useProjectList";
import React, { useContext, useEffect, useState } from "react";
import { TypeArea } from "../TypeArea";
import { Container, Content, DataContainer, DataItem, ProcessText } from "./index.styled";

const Data = ({ value, label }: { value: string; label: string }) => {
  return (
    <DataItem>
      <p>{value} ETH</p>
      <p>{label}</p>
    </DataItem>
  );
};

export const ProjestList = () => {
  const { state } = useContext(ProjectContext);
  const createing = state.type === "createing";
  const projestList = useProjectList();
  const [newProjectList, setNewProjectList] = useState<Project[]>([]);

  useEffect(() => {
    if (state.type === "created") {
      newProjectList.push(state.payload);
      setNewProjectList([...newProjectList]);
    }
  }, [state]);

  return (
    <TypeArea>
      <Container>
        {[...projestList, ...newProjectList].map((item, i) => {
          const percent = new BigNumber(item.balance).div(item.goal).toNumber();

          return (
            <Card title={item.description} key={i}>
              <Content>
                <DataContainer>
                  <Data label="募资上限" value={web3.utils.fromWei(item.goal)} />
                  <Data label="最小投资金额" value={web3.utils.fromWei(item.minInvest)} />
                  <Data label="最大投资金额" value={web3.utils.fromWei(item.maxInvest)} />
                  <Data label="参与投资人数" value={item.investorCount} />
                  <Data label="已募资金额" value={web3.utils.fromWei(item.balance)} />
                </DataContainer>
                <Progress
                  type="circle"
                  format={(percent) => (
                    <>
                      <ProcessText>募资进度</ProcessText>
                      <br />
                      {percent}
                    </>
                  )}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  percent={percent}
                />
              </Content>
            </Card>
          );
        })}
        {createing && (
          <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 330 }}>
            <Spin size="large" tip="项目创建中" />
          </Card>
        )}
      </Container>
    </TypeArea>
  );
};
