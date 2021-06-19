import Web3 from "web3";
import { rinkebyUrl } from "../scripts/config";

let web3: Web3;

// 浏览器环境且已经安装了 Metamask
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // 服务器环境或者没有安装 Metamask
  web3 = new Web3(new Web3.providers.HttpProvider(rinkebyUrl));
}

export default web3;
