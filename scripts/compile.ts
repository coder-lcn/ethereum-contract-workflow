import fs from "fs";
import path from "path";
import solc from "solc";

const contractPath = path.resolve(__dirname, "../contracts", "Car.sol");
const contractSource = fs.readFileSync(contractPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    "Car.sol": {
      content: contractSource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(output.contracts["Car.sol"].Car.abi);
