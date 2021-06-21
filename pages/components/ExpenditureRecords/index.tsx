import { Modal, Table, Tag } from "antd";
import Project from "lib/project";
import { AppContext } from "pages/context";
import React, { useContext, useEffect, useState } from "react";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface IProps {
  project: Project | boolean;
  setProject: (val: Project | boolean) => void;
}

const columns = [
  {
    title: "支出理由",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "支出金额",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "收款人",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "状态",
    dataIndex: "address",
    key: "address1",
  },
  {
    title: "操作",
    key: "tags",
    dataIndex: "tags",
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

export const ExpenditureRecords = ({ project, setProject }: IProps) => {
  const [data, setData] = useState<PayRecord[]>([]);
  const { accounts } = useContext(AppContext);
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

  useEffect(() => {
    const getRecords = async () => {
      const paymentsCount = Number(target.paymentsCount);
      const contract = Project(target.address);
      const tasks = [];

      if (paymentsCount > 0) {
        for (let i = 0; i < paymentsCount; i++) {
          tasks.push(contract.methods.payments(i).call());
        }
      }

      const payments = await Promise.all<PayRecord[]>(tasks);
      console.log(payments, "payments");
    };

    target && visible && getRecords();
  }, [target]);

  return (
    <Modal
      footer={null}
      width={1200}
      title={target.description + " 资金支出记录"}
      visible={visible}
      onCancel={() => setProject(false)}
    >
      <Table bordered columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </Modal>
  );
};
