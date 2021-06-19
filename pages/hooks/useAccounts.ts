import { useEffect, useState } from "react";
import web3 from "../../lib/web3";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const init = async () => {
    // 请求连接钱包
    await window.ethereum.enable();

    const accounts = await web3.eth.getAccounts();

    const accountsInfo = await Promise.all(
      accounts.map(async (account) => {
        const balance = await web3.eth.getBalance(account);

        return {
          account,
          eth: web3.utils.fromWei(balance),
        };
      })
    );

    setAccounts(accountsInfo);
  };

  useEffect(() => {
    init();
  }, []);

  return accounts;
};
