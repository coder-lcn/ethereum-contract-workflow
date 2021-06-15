import HDWalletProvider from "@truffle/hdwallet-provider";
import path from "path";
import Web3 from "web3";
import { memonic, rinkebyUrl } from "./config";

// 1. 拿到 bytecode
const contractPath = path.resolve(__dirname, "../compiled/Car.json");
const { abi, evm } = require(contractPath);

// 2. 配置 provider
const provider = new HDWalletProvider(memonic, rinkebyUrl);

// 3. 初始化 web3 实例
const web3 = new Web3(provider);

(async () => {
  // 4. 获取钱包里面的账户
  const accounts = await web3.eth.getAccounts();
  console.log("部署合约的账户：", accounts[0]);

  // 5. 创建合约实例并且部署
  console.time("contract-deploy");
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["AUDI"] })
    .send({ from: accounts[0], gas: 1000000 });
  console.timeEnd("contract-deploy");

  console.log("合约部署成功：", result.options.address);
})();
