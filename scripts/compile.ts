import fs from "fs-extra";
import path from "path";
import solc from "solc";

// cleanup
const compiledDir = path.resolve(__dirname, "../compiled");
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

// compile
const contractPath = path.resolve(__dirname, "../contracts", "Car.sol");
const contractSource = fs.readFileSync(contractPath, "utf8");

const input = {
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

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// check errors
if (Array.isArray(output.errors) && output.errors.length) {
  throw new Error(output.errors[0].formattedMessage);
}

Object.keys(output.contracts).forEach((name) => {
  const contractName = name.split(".")[0];
  const filePath = path.resolve(compiledDir, `${contractName}.json`);

  fs.outputJsonSync(filePath, output.contracts[name][contractName]);
  console.log(`save compiled contract ${contractName} to ${filePath}`);
});
