import ganache from "ganache-cli";
import path from "path";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

// 1. 拿到 bytecode
const contractPath = path.resolve(__dirname, "../compiled/Car.json");
const { abi, evm } = require(contractPath);

// 2. 配置 provider
const web3 = new Web3(ganache.provider());

let accounts: string[];
let contract: Contract;

const initialBrand = "AUDI";

describe("contract", () => {
  // 3. 每次跑单测时需要部署全新的合约实例，起到隔离的作用
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    contract = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object, arguments: [initialBrand] })
      .send({ from: accounts[0], gas: 1000000 });
  });

  // 4. 编写单元测试
  it("deploy a contract", () => {
    expect(contract.options.address).toBeDefined();
  });

  it("has initial brand", async () => {
    const brand = await contract.methods.brand().call();
    expect(brand).toEqual(initialBrand)
  });

  it("can change the brand", async () => {
    const newBrand = "BWM";
    await contract.methods.setBrand(newBrand).send({ from: accounts[0] });
    const brand = await contract.methods.brand().call();
    expect(brand).toEqual(newBrand);
  });
});
