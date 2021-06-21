import { useContext, useEffect } from "react";
import { payContext } from "../context";

export const useUpdateProject = (projects: Project[], setProjects: (projects: Project[]) => void) => {
  const { state } = useContext(payContext);

  useEffect(() => {
    if (state.type === "success") {
      const index = projects.findIndex((v) => v.address === state.payload.processingProject.address);

      if (index !== -1) {
        projects[index].paymentsCount = (Number(projects[index].paymentsCount) + 1).toString();
        setProjects([...projects]);
      }
    }
  }, [state]);

  return null;
};
