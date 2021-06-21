import { useUpdateProject } from "pages/hooks/useUpdateProject";
import { useContext, useEffect, useState } from "react";
import Project from "../../lib/project";
import ProjectList from "../../lib/projectList";
import { investmenContext } from "../context";

export const useProjectList = () => {
  const [list, setList] = useState<Project[]>([]);
  const { state } = useContext(investmenContext);

  useUpdateProject(list, setList);

  const getList = async () => {
    const addressList = (await ProjectList.methods.getProjects().call()) as string[];
    const summaryList = (
      await Promise.all(addressList.map((address) => Project(address).methods.getSummary().call()))
    ).map((item, i) => {
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
        address: addressList[i],
      };
    });

    setList(summaryList);
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (state.type === "success") {
      getList();
    }
  }, [state]);

  return list;
};
