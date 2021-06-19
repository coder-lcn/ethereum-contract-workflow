import { useEffect, useState } from "react";
import web3 from "../../lib/web3";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const setAccountsData = async (accountAddress: string[]) => {
    const accountsInfo = await Promise.all(
      accountAddress.map(async (account) => {
        const balance = await web3.eth.getBalance(account);

        return {
          account,
          eth: web3.utils.fromWei(balance),
        };
      })
    );

    setAccounts(accountsInfo);
  };

  const init = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccountsData(accounts);
  };

  const watch = () => {
    window.ethereum.on("accountsChanged", setAccountsData);
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    init();
    watch();
  }, []);

  return accounts;
};
