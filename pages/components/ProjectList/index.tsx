import { Button, Card, Empty, Progress, Spin } from "antd";
import BigNumber from "bignumber.js";
import web3 from "lib/web3";
import { AppContext, investmenContext, payContext, ProjectContext } from "pages/context";
import { useProjectList } from "pages/hooks/useProjectList";
import { useUpdateProject } from "pages/hooks/useUpdateProject";
import React, { useContext, useEffect, useState } from "react";
import { ExpenditureRecords } from "../ExpenditureRecords";
import { Investment } from "../Investment";
import { RequestPay } from "../RequestPay";
import { TypeArea } from "../TypeArea";
import { Container, Content, DataContainer, DataItem, ProcessText } from "./index.styled";

const Data = ({ value, label, unit = true }: { value: string; label: React.ReactNode; unit?: boolean }) => {
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
  const { state: payState } = useContext(payContext);
  const { state } = useContext(ProjectContext);
  const { account } = useContext(AppContext);

  const createing = state.type === "createing";

  const projestList = useProjectList();
  const [newProjectList, setNewProjectList] = useState<Project[]>([]);
  const [currInvestmentTarget, setCurrInvestmentTarget] = useState<Project | boolean>(false);
  const [currPayTarget, setCurrPayTarget] = useState<Project | boolean>(false);
  const [currPayRecordTarget, setCurrPayRecordTarget] = useState<Project | boolean>(false);

  useUpdateProject(newProjectList, setNewProjectList);

  useEffect(() => {
    if (state.type === "success") {
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
        {createing && (
          <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 330 }}>
            <Spin size="large" tip="项目创建中" />
          </Card>
        )}
        {[...projestList, ...newProjectList].map((item, i) => {
          const percent = new BigNumber(item.balance).div(item.goal).multipliedBy(100).toNumber().toFixed(2);
          const Investing = investmenState.payload.find((v) => v.address === item.address);
          const paying = payState.payload.list.find((v) => v.address === item.address);
          const canPay = account === item.owner.toLowerCase();

          return (
            <Card
              title={item.description}
              key={i}
              extra={
                <>
                  <Button type="primary" onClick={() => setCurrInvestmentTarget(item)} loading={Boolean(Investing)}>
                    {Investing ? "投资中" : "投资"}
                  </Button>
                  {canPay && (
                    <Button
                      style={{ marginLeft: 10 }}
                      type="ghost"
                      onClick={() => setCurrPayTarget(item)}
                      loading={Boolean(paying)}
                    >
                      {paying ? "正在请求支出" : "支出"}
                    </Button>
                  )}
                </>
              }
            >
              <Content>
                <DataContainer>
                  <Data label="募资上限" value={web3.utils.fromWei(item.goal)} />
                  <Data label="最小投资金额" value={web3.utils.fromWei(item.minInvest)} />
                  <Data label="最大投资金额" value={web3.utils.fromWei(item.maxInvest)} />
                  <Data label="参与投资人数" value={item.investorCount} unit={false} />
                  <Data label="已募资金额" value={web3.utils.fromWei(item.balance)} />
                  <Data
                    label={<a onClick={() => setCurrPayRecordTarget(item)}>资金支出</a>}
                    value={item.paymentsCount}
                    unit={false}
                  />
                </DataContainer>
                <Progress
                  type="circle"
                  format={(percent) => (
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
                  percent={Number(percent)}
                />
              </Content>
            </Card>
          );
        })}
      </Container>
      <Investment project={currInvestmentTarget} setProject={setCurrInvestmentTarget} />
      <RequestPay project={currPayTarget} setProject={setCurrPayTarget} />
      <ExpenditureRecords project={currPayRecordTarget} setProject={setCurrPayRecordTarget} />
    </TypeArea>
  );
};
