import { Button, Card, Empty, Progress, Spin } from "antd";
import BigNumber from "bignumber.js";
import web3 from "lib/web3";
import { investmenContext, ProjectContext } from "pages/context";
import { useProjectList } from "pages/hooks/useProjectList";
import React, { useContext, useEffect, useState } from "react";
import { Investment } from "../Investment";
import { TypeArea } from "../TypeArea";
import { Container, Content, DataContainer, DataItem, ProcessText } from "./index.styled";

const Data = ({ value, label, unit = true }: { value: string; label: string; unit?: boolean }) => {
  return (
    <DataItem>
      <p>
        {value} {unit && "ETH"}
      </p>
      <p>{label}</p>
    </DataItem>
  );
};

export const ProjestList = () => {
  const { state: investmenState } = useContext(investmenContext);
  const { state } = useContext(ProjectContext);

  const createing = state.type === "createing";

  const projestList = useProjectList();
  const [newProjectList, setNewProjectList] = useState<Project[]>([]);
  const [currInvesmentTarget, setCurrInvesmentTarget] = useState<Project | boolean>(false);

  useEffect(() => {
    if (state.type === "created") {
      newProjectList.push(state.payload);
      setNewProjectList([...newProjectList]);
    }
  }, [state]);

  useEffect(() => {
    setNewProjectList([]);
  }, [projestList]);

  return (
    <TypeArea>
      {!projestList.length && !newProjectList.length && !createing && (
        <Empty description="暂无项目" style={{ margin: "100px auto" }} />
      )}
      <Container>
        {[...projestList, ...newProjectList].map((item, i) => {
          const percent = new BigNumber(item.balance).div(item.goal).multipliedBy(100).toNumber();
          const Investing = investmenState.payload.find((v) => v.address === item.address);

          return (
            <Card
              title={item.description}
              key={i}
              extra={
                <Button type="primary" onClick={() => setCurrInvesmentTarget(item)} loading={Boolean(Investing)}>
                  {Investing ? "投资中" : "立即投资"}
                </Button>
              }
            >
              <Content>
                <DataContainer>
                  <Data label="募资上限" value={web3.utils.fromWei(item.goal)} />
                  <Data label="最小投资金额" value={web3.utils.fromWei(item.minInvest)} />
                  <Data label="最大投资金额" value={web3.utils.fromWei(item.maxInvest)} />
                  <Data label="参与投资人数" value={item.investorCount} unit={false} />
                  <Data label="已募资金额" value={web3.utils.fromWei(item.balance)} />
                  <Data label="资金支出请求数" value={item.paymentsCount} unit={false} />
                </DataContainer>
                <Progress
                  type="circle"
                  format={() => (
                    <>
                      <ProcessText>募资进度</ProcessText>
                      <br />
                      {percent}%
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
      <Investment project={currInvesmentTarget} setProject={setCurrInvesmentTarget} />
    </TypeArea>
  );
};
