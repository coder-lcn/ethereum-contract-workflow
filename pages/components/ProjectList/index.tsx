import { Card, Progress } from "antd";
import BigNumber from "bignumber.js";
import React from "react";
import web3 from "../../../lib/web3";
import { useProjectList } from "../../hooks/useProjectList";
import { TypeArea } from "../TypeArea";
import { Container, Content, DataContainer, DataItem } from "./index.styled";

const Data = ({ value, label }: { value: string; label: string }) => {
  return (
    <DataItem>
      <p>{value} ETH</p>
      <p>{label}</p>
    </DataItem>
  );
};

export const ProjestList = () => {
  const projestList = useProjectList();

  return (
    <TypeArea>
      <Container>
        {projestList.map((item) => {
          const percent = new BigNumber(item.balance).div(item.goal).toNumber();

          return (
            <Card title={item.description}>
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
      </Container>
    </TypeArea>
  );
};
