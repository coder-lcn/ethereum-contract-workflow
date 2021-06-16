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
