import { Form, FormInstance, Input, Modal } from "antd";
import { ValidateStatus } from "antd/lib/form/FormItem";
import Project from "lib/project";
import web3 from "lib/web3";
import { AppContext, investmenContext } from "pages/context";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import React, { FormEventHandler, useContext, useRef, useState } from "react";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface IProps {
  project: Project | boolean;
  setProject: (val: Project | boolean) => void;
}

export const Investment = ({ project, setProject }: IProps) => {
  const { dispatch } = useContext(investmenContext);
  const { account } = useContext(AppContext);
  const formRef = useRef<FormInstance | null>(null);
  const visible = Boolean(project);

  const [validateStatus, setValidateStatus] = useState<ValidateStatus>("success");
  const [errorTip, setErrorTip] = useState(null);

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

  const min = Number(web3.utils.fromWei(currInvestment.minInvest, "ether"));
  const max = Number(web3.utils.fromWei(currInvestment.maxInvest, "ether"));

  const onCancel = () => {
    setProject(false);
  };

  const afterClose = () => {
    formRef.current && formRef.current.resetFields();
    setValidateStatus("success");
    setErrorTip(null);
  };

  const onSure = async () => {
    formRef.current && formRef.current.submit();
  };

  const onFinish = async ({ amount }: { amount: string }) => {
    setProject(false);

    try {
      dispatch({ type: "investing", payload: [currInvestment] });

      const contract = Project(currInvestment.address);

      await contract.methods
        .contribute()
        .send({ from: account, value: web3.utils.toWei(amount, "ether"), gas: "5000000" });

      dispatch({ type: "success", msg: "投资成功", payload: [currInvestment] });
    } catch (error) {
      dispatch({ type: "failed", msg: error.message, payload: [currInvestment] });
    }
  };

  const onChange: FormEventHandler = (e) => {
    const input = e.target as HTMLInputElement;

    if (input) {
      const value = Number(input.value);

      if (value < min) {
        setErrorTip("最小投资金额：" + min + "ETH");
        setValidateStatus("error");
      } else if (value > max) {
        setErrorTip("最大投资金额：" + max + "ETH");
        setValidateStatus("error");
      } else {
        setValidateStatus("success");
        setErrorTip("");
      }
    }
  };

  const onFinishFailed: (errorInfo: ValidateErrorEntity<{ amount: number }>) => void = (e) => {
    if (!e.values.amount) {
      setErrorTip("请输入投资金额");
      setValidateStatus("error");
    }
  };

  return (
    <Modal
      title={"投资项目：" + currInvestment.description}
      visible={visible}
      onOk={onSure}
      onCancel={onCancel}
      afterClose={afterClose}
      centered
    >
      <Form
        {...layout}
        name="basic"
        ref={formRef}
        labelAlign="right"
        onFinish={onFinish}
        onChange={onChange}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="投资金额"
          name="amount"
          hasFeedback
          validateStatus={validateStatus}
          help={errorTip}
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder={`${min}-${max}`} suffix="ETH" autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
};
