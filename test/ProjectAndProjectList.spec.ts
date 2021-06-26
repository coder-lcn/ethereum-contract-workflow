import assert from "assert";
import BigNumber from "bignumber.js";
import ganache from "ganache-cli";
import path from "path";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

const web3 = new Web3(ganache.provider());
const { abi: ProjectListABI, evm: ProjectListEvm } = require(path.resolve(__dirname, "../compiled/ProjectList.json"));
const { abi: ProjectABI } = require(path.resolve(__dirname, "../compiled/Project.json"));

let accounts: string[];
let projectList: Contract;
let project: Contract;

describe("Project Contract", () => {
  // 1. 每次跑单测时需要部署全新的合约实例，起到隔离的作用
  beforeEach(async () => {
    // 1.1 拿到 ganache 本地测试网络的账号
    accounts = await web3.eth.getAccounts();

    // 1.2 部署 ProjectList 合约
    projectList = await new web3.eth.Contract(ProjectListABI)
      .deploy({ data: ProjectListEvm.bytecode.object })
      .send({ from: accounts[0], gas: 5000000 });

    // 1.3 调用 ProjectList 的 createProject 方法
    await projectList.methods.createProject("Ethereum DApp Tutorial", 100, 10000, 1000000).send({
      from: accounts[0],
      gas: 5000000,
    });

    // 1.4 获取刚创建的 Project 实例的地址
    const [address] = await projectList.methods.getProjects().call();

    // 1.5 生成可用的 Project 合约对象
    project = new web3.eth.Contract(ProjectABI, address);
  });

  it("should deploy ProjectList and Project", async () => {
    expect(projectList.options.address).toBeDefined();
    expect(project.options.address).toBeDefined();
  });

  it("should save correct project properties", async () => {
    const owner = await project.methods.owner().call();
    const description = await project.methods.description().call();
    const minInvest = await project.methods.minInvest().call();
    const maxInvest = await project.methods.maxInvest().call();
    const goal = await project.methods.goal().call();

    expect(owner).toEqual(accounts[0]);
    expect(description).toEqual("Ethereum DApp Tutorial");
    expect(minInvest).toEqual("100");
    expect(maxInvest).toEqual("10000");
    expect(goal).toEqual("1000000");
  });

  it("should allow investor to contribute", async () => {
    const investor = accounts[1];
    await project.methods.contribute().send({
      from: investor,
      value: "200",
    });

    const amount = await project.methods.investors(investor).call();
    expect(amount).toEqual("200");
  });

  it("should require minInvest", async () => {
    try {
      const investor = accounts[1];
      await project.methods.contribute().send({
        from: investor,
        value: "10",
      });
      assert.ok(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it("should require maxInvest", async () => {
    try {
      const investor = accounts[1];
      await project.methods.contribute().send({
        from: investor,
        value: "100000",
      });
      assert.ok(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it("check multiple investments", async () => {
    // 项目方
    const owner = accounts[0];
    // 收款方
    const receiver = accounts[1];
    // 投资人 A、B
    const investorA = accounts[2];
    const investorB = accounts[3];

    await project.methods.contribute().send({
      from: investorA,
      value: "5000",
    });

    const firstPaymentMoney = await project.methods.investors(investorA).call();
    const firstInvestmentsCount = await project.methods.investorCount().call();
    expect(firstPaymentMoney).toEqual("5000");
    expect(firstInvestmentsCount).toEqual("1");

    await project.methods.contribute().send({
      from: investorA,
      value: "2000",
    });

    const secondPaymentMoney = await project.methods.investors(investorA).call();
    const secondInvestmentsCount = await project.methods.investorCount().call();
    expect(secondPaymentMoney).toEqual("7000");
    expect(secondInvestmentsCount).toEqual("1");

    await project.methods.contribute().send({
      from: investorB,
      value: "1000",
    });

    const thirdPaymentMoney = await project.methods.investors(investorB).call();
    const thirdInvestmentsCount = await project.methods.investorCount().call();
    expect(thirdPaymentMoney).toEqual("1000");
    expect(thirdInvestmentsCount).toEqual("2");
  });

  it("allows investor to approve payments", async () => {
    // 项目方
    const owner = accounts[0];
    // 收款方
    const receiver = accounts[1];
    // 投资人
    const investorA = accounts[2];

    // 收款前的余额
    const oldBalance = new BigNumber(await web3.eth.getBalance(receiver));

    // 投资项目
    await project.methods.contribute().send({
      from: investorA,
      value: "3000",
    });

    // 资金支出请求
    await project.methods.createPayment("Rent Office", 2000, receiver).send({
      from: owner,
      gas: "5000000",
    });

    // 投资人 A 赞成投票
    await project.methods.approvePayment(0).send({
      from: investorA,
      gas: "5000000",
    });

    // // 资金划转
    await project.methods.doPayment(0).send({
      from: owner,
      gas: "5000000",
    });

    // 检查 payment 状态
    const payment = await project.methods.payments(0).call();
    expect(payment.completed).toEqual(true);
    expect(payment.voterCount).toEqual("1");
    const approvePeople = payment.approve.split("-").filter(Boolean);
    expect(approvePeople.includes(investorA.toLowerCase())).toEqual(true);

    // 收款后的余额
    const newBalance = new BigNumber(await web3.eth.getBalance(receiver));
    const balanceDiff = newBalance.minus(oldBalance);

    // 确保精确的余额变化
    expect(balanceDiff.toNumber()).toEqual(2000);
  });
});
