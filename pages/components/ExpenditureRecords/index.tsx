import { Modal, Space, Table, Tag, Typography } from "antd";
import Project from "lib/project";
import web3 from "lib/web3";
import { AppContext } from "pages/context";
import React, { useContext, useEffect, useState } from "react";

const { Paragraph } = Typography;

interface IProps {
  project: Project | boolean;
  setProject: (val: Project | boolean) => void;
}

export const ExpenditureRecords = ({ project, setProject }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PayRecord[]>([]);
  const { account } = useContext(AppContext);
  const visible = Boolean(project);

  const target: Project = visible
    ? (project as Project)
    : {
        address: "",
        description: "",
        minInvest: "",
        maxInvest: "",
        goal: "",
        balance: "",
        investorCount: "",
        paymentsCount: "",
        owner: "",
      };

  const onApprove = async (i: number) => {
    // const contract = Project(target.address);
    // await contract.methods.approvePayment(i).send({ from: account, gas: "5000000" });
  };

  const columns = [
    {
      title: "支出理由",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "支出金额",
      dataIndex: "amount",
      key: "amount",
      render: (value: string) => {
        return web3.utils.fromWei(value, "ether") + " ETH";
      },
    },
    {
      title: "收款人",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver: string) => {
        return (
          <Paragraph style={{ margin: 0 }} copyable>
            {receiver}
          </Paragraph>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "completed",
      key: "completed",
      width: 100,
      render: (status: Boolean) => {
        // 反对 volcano
        // 等待投票 geekblue
        // 赞成 green
        return (
          <Tag style={{ margin: 0 }} color="geekblue">
            等待投票
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "controller",
      dataIndex: "controller",
      render: (val: string, row: PayRecord, index: number) => {
        return (
          <Space size="middle">
            <a onClick={() => onApprove(index)}>赞成</a>
            <a>反对</a>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const getRecords = async () => {
      setLoading(true);

      const paymentsCount = Number(target.paymentsCount);
      const contract = Project(target.address);
      const tasks = [];

      if (paymentsCount > 0) {
        for (let i = 0; i < paymentsCount; i++) {
          tasks.push(contract.methods.payments(i).call());
        }
      }

      const payments = await Promise.all<PayRecord>(tasks);
      console.log(payments);

      setData(payments);
      setLoading(false);
    };

    target && visible && getRecords();
  }, [target]);

  return (
    <Modal
      footer={null}
      width={1200}
      title={target.description + " 资金支出记录"}
      visible={visible}
      afterClose={() => {
        setData([]);
      }}
      onCancel={() => setProject(false)}
    >
      <Table loading={loading} bordered columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </Modal>
  );
};
