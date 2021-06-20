declare module "solc" {
  namespace solc {
    export interface API {
      compile: (inputStringify: string) => string;
    }
  }
  const solc: solc.API;
  export = solc;
}

declare module "ganache-cli" {
  namespace ganache {
    export interface API {
      provider: () => string;
    }
  }
  const ganache: ganache.API;
  export = ganache;
}

declare interface Window {
  web3: any;
  ethereum: any;
}

declare interface Account {
  account: string;
  eth: string;
}

declare interface Project {
  address: string;
  description: string;
  minInvest: string;
  maxInvest: string;
  goal: string;
  balance: string;
  investorCount: string;
  paymentsCount: string;
  owner: string;
}

declare namespace Store {
  export type ProjectStatus = "createing" | "created" | "normal" | "failed" | "success";
  export type InvestmentStatus = "investing" | "normal" | "failed" | "success";

  export interface ProjectStore {
    type: ProjectStatus;
    payload?: Project;
    msg?: string;
  }

  export interface InvestmentStore {
    type: InvestmentStatus;
    payload: Project[];
    msg?: string;
  }
}
