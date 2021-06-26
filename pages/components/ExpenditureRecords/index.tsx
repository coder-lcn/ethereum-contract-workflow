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
  const accountAddress = account.toLowerCase();
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
        invested: false,
      };

  const onApprove = async (i: number) => {
    const contract = Project(target.address);
    await contract.methods.approvePayment(i).send({ from: account, gas: "5000000" });
  };

  const canTransfer = ({ approve }: PayRecord) => {
    const approvedCount = approve.split("-").filter(Boolean).length;
    const { investorCount } = target;
    return approvedCount > Number(investorCount) / 2;
  };

  const renderStatus = (status: Boolean, row: PayRecord, index: number) => {
    const { approve, disApprove } = row;
    const { invested } = target;

    if (invested) {
      if (approve.indexOf(accountAddress) !== -1) {
        return (
          <Tag style={{ margin: 0 }} color="green">
            已赞成
          </Tag>
        );
      } else if (disApprove.indexOf(accountAddress) !== -1) {
        return (
          <Tag style={{ margin: 0 }} color="volcano">
            已反对
          </Tag>
        );
      } else {
        return (
          <Tag style={{ margin: 0 }} color="geekblue">
            等待投票
          </Tag>
        );
      }
    } else {
      return <Tag style={{ margin: 0 }}>投票中</Tag>;
    }
  };

  const renderOperating = (val: string, row: PayRecord, index: number) => {
    const { approve } = row;
    const approved = approve.indexOf(accountAddress) !== -1;
    const transfer = canTransfer(row);

    if (transfer && target.owner.toLowerCase() === accountAddress) {
      return (
        <a
          onClick={async () => {
            const contract = Project(target.address);
            await contract.methods.doPayment(index).send({ from: account, gas: "5000000" });
          }}
        >
          资金划转
        </a>
      );
    }

    return (
      <Space size="middle">
        {approved ? (
          <a>已赞成</a>
        ) : (
          <>
            <a onClick={() => onApprove(index)}>赞成</a>
            <a>反对</a>
          </>
        )}
      </Space>
    );
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
      render: renderStatus,
    },
    {
      title: "操作",
      key: "controller",
      dataIndex: "controller",
      render: renderOperating,
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

      const result = payments.map((item, i) => {
        return {
          ...item,
          key: i,
        };
      });

      setData(result);
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
