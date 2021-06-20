import { investmenContext, investmenContextInitValue } from "pages/context";
import React, { useReducer } from "react";
import reducer from "./reducer";

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, investmenContextInitValue);
  return (
    <investmenContext.Provider value={{ state: state as Store.InvestmentStore, dispatch }}>
      {children}
    </investmenContext.Provider>
  );
};

export default { Provider };
