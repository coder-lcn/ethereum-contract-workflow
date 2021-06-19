import { AbiItem } from "web3-utils";
import Project from "../compiled/Project.json";
import web3 from "./web3";

const getContract = (address: string) => new web3.eth.Contract(Project.abi as AbiItem[], address);

export default getContract;
