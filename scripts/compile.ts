import fs from "fs-extra";
import path from "path";
import solc from "solc";

// 1. cleanup
const compiledDir = path.resolve(__dirname, "../compiled");
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

// 2. get all contracts params
const contractFiles = fs.readdirSync(path.resolve(__dirname, "../contracts"));
const input = contractFiles.reduce(
  (pre, next) => {
    const contractPath = path.resolve(__dirname, "../contracts", next);
    const contractSource = fs.readFileSync(contractPath, "utf8");

    pre.sources[next] = {
      content: contractSource,
    };

    return pre;
  },
  {
    language: "Solidity",
    sources: {},
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  }
);

// 3. compile
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// 4. check errors
if (Array.isArray(output.errors) && output.errors.length) {
  throw new Error(output.errors[0].formattedMessage);
}

// 5. record printing results
Object.keys(output.contracts).forEach((name) => {
  const contractName = name.split(".")[0];
  const filePath = path.resolve(compiledDir, `${contractName}.json`);

  fs.outputJsonSync(filePath, output.contracts[name][contractName]);
  console.log(`contract ${contractName} save to ${filePath}`);
});
