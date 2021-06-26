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
  invested: boolean;
}

declare interface PayRecord {
  key: number;
  description: string;
  pay: string;
  receiver: string;
  approve: string;
  disApprove: string;
  completed: boolean;
}

declare namespace Store {
  type CommonStatus = "normal" | "failed" | "success";

  type ProjectStatus = "createing" | CommonStatus;
  type InvestmentStatus = "investing" | CommonStatus;
  type payStatus = "paying" | CommonStatus;

  interface ProjectStore {
    type: ProjectStatus;
    payload?: Project;
    msg?: string;
  }

  interface InvestmentStore {
    type: InvestmentStatus;
    payload: Project[];
    msg?: string;
  }

  interface payStore {
    type: payStatus;
    payload: {
      list: Project[];
      processingProject?: Project;
    };
    msg?: string;
  }
}

declare namespace TabListProps {
  type Value = "All" | "Invested" | "Create";

  type TabProps = {
    label: string;
    value: Value;
  };

  type TabsProps = TabProps[];
}
