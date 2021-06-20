import { ProjectContext, ProjectContextInitValue } from "pages/context";
import React, { useReducer } from "react";
import reducer from "./reducer";

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, ProjectContextInitValue);
  return (
    <ProjectContext.Provider value={{ state: state as Store.ProjectStore, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default { Provider };
