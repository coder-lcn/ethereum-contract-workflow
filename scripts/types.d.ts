declare module "solc" {
  namespace solc {
    export interface API {
      compile: (inputStringify: string) => string;
    }
  }
  const solc: solc.API;
  export = solc;
}
