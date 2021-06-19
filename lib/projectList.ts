import { AbiItem } from "web3-utils";
import address from "../address.json";
import ProjectList from "../compiled/ProjectList.json";
import web3 from "./web3";

const contract = new web3.eth.Contract(ProjectList.abi as AbiItem[], address);

export default contract;
