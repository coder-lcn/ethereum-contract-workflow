import { payContext, payContextInitValue } from "pages/context";
import React, { useReducer } from "react";
import reducer from "./reducer";

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, payContextInitValue);
  return <payContext.Provider value={{ state: state as Store.payStore, dispatch }}>{children}</payContext.Provider>;
};

export default { Provider };
