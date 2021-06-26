import Project from "lib/project";
import ProjectList from "lib/projectList";
import { useUpdateProject } from "pages/hooks/useUpdateProject";
import { useContext, useEffect, useState } from "react";
import { AppContext, investmenContext } from "../context";

export const useProjectList = () => {
  const { state } = useContext(investmenContext);
  const { account } = useContext(AppContext);
  const [list, setList] = useState<Project[]>([]);

  useUpdateProject(list, setList);

  const getList = async () => {
    const addressList = (await ProjectList.methods.getProjects().call()) as string[];

    const getAllProjectDetail = await Promise.all(
      addressList.map((address) => Project(address).methods.getSummary().call())
    );
    const getAllProjectInvestmentStatus = await Promise.all(
      addressList.map(async (address) => {
        try {
          const money = await Project(address).methods.investors(account).call();
          return Boolean(Number(money));
        } catch (error) {
          return false;
        }
      })
    );

    const summaryList = getAllProjectDetail.map((item, i) => {
      const [description, minInvest, maxInvest, goal, balance, investorCount, paymentsCount, owner] =
        Object.values(item);
      const address = addressList[i];
      const invested = getAllProjectInvestmentStatus[i];

      return {
        description,
        minInvest,
        maxInvest,
        goal,
        balance,
        investorCount,
        paymentsCount,
        owner,
        address,
        invested,
      };
    });

    setList(summaryList);
  };

  useEffect(() => {
    getList();
  }, [account]);

  useEffect(() => {
    if (state.type === "success") {
      getList();
    }
  }, [state]);

  return list;
};
