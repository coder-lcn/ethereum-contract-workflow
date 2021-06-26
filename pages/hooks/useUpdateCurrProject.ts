import { useState } from "react";

export const useUpdateCurrProject = (depend: Project[]) => {
  const [currProject, setCurrProject] = useState<Project | boolean>(false);

  useEffect;

  return [currProject, setCurrProject];
};
