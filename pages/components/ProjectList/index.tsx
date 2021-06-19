import React from "react";
import { useProjectList } from "../../hooks/useProjectList";

export const ProjestList = () => {
  const projestList = useProjectList();
  return <div>{projestList}</div>;
};
