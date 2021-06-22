import { Form, FormInstance, Input, Modal } from "antd";
import Project from "lib/project";
import web3 from "lib/web3";
import { AppContext, payContext } from "pages/context";
import React, { useContext, useRef } from "react";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface IProps {
  project: Project | boolean;
  setProject: (val: Project | boolean) => void;
}

export const RequestPay = ({ project, setProject }: IProps) => {
  const { dispatch } = useContext(payContext);
  const { account } = useContext(AppContext);
  const formRef = useRef<FormInstance | null>(null);
  const visible = Boolean(project);

  const currInvestment: Project = visible
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

  const maxBalance = Number(web3.utils.fromWei(currInvestment.balance, "ether"));

  const onCancel = () => {
    setProject(false);
  };

  const afterClose = () => {
    formRef.current && formRef.current.resetFields();
  };

  const onSure = async () => {
    formRef.current && formRef.current.submit();
  };

  const onFinish = async (values: PayRecord) => {
    const { description, pay, receiver } = values;

    const amountInWei = web3.utils.toWei(pay, "ether");

    try {
      setProject(false);

      dispatch({ type: "paying", payload: { list: [currInvestment] } });

      await Project(currInvestment.address)
        .methods.createPayment(description, amountInWei, receiver)
        .send({ from: account, gas: "5000000" });

      dispatch({
        type: "success",
        payload: { list: [currInvestment] },
        msg: currInvestment.description + " 项目发起支出请求成功",
      });
    } catch (error) {
      dispatch({
        type: "failed",
        payload: {
          list: [currInvestment],
        },
        msg: error.message,
      });
    }
  };

  return (
    <Modal
      title={`${currInvestment.description} 项目资金支出`}
      visible={visible}
      onOk={onSure}
      onCancel={onCancel}
      afterClose={afterClose}
      centered
    >
      <Form {...layout} name="basic" ref={formRef} labelAlign="right" onFinish={onFinish}>
        <Form.Item label="支出理由" name="description" rules={[{ required: true, message: "请输入项目名称" }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="支出金额"
          name="pay"
          rules={[
            { required: true, message: "请输入支出金额" },
            () => ({
              validator(_, value) {
                if (Number(value) > Number(maxBalance)) {
                  return Promise.reject(new Error(`支出金额不能大于 ${maxBalance} ETH`));
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input type="number" suffix="ETH" />
        </Form.Item>
        <Form.Item label="收款方" name="receiver" rules={[{ required: true, message: "请输入项目名称" }]}>
          <Input autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
