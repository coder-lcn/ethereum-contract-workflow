import { useEffect, useState } from "react";
import Project from "../../lib/project";
import ProjectList from "../../lib/projectList";

export const useProjectList = () => {
  const [list, setList] = useState<Project[]>([]);

  const getList = async () => {
    const addressList = (await ProjectList.methods.getProjects().call()) as string[];

    const summaryList = (
      await Promise.all(addressList.map((address) => Project(address).methods.getSummary().call()))
    ).map((item) => {
      const [description, minInvest, maxInvest, goal, balance, investorCount, paymentsCount, owner] =
        Object.values(item);
      return {
        description,
        minInvest,
        maxInvest,
        goal,
        balance,
        investorCount,
        paymentsCount,
        owner,
      };
    });

    setList(summaryList);
  };

  useEffect(() => {
    getList();
  }, []);

  return list;
};
