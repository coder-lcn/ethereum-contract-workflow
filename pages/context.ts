import React from "react";

export const AppContextInitValue: { accounts: Account[] } = { accounts: [] };
export const AppContext = React.createContext(AppContextInitValue);

export const ProjectContextInitValue: Store.ProjectStore = {
  type: "normal",
  payload: {
    description: "",
    minInvest: "",
    maxInvest: "",
    goal: "",
    balance: "",
    investorCount: "",
    paymentsCount: "",
    owner: "",
  },
};
export const ProjectContext = React.createContext<{
  state: Store.ProjectStore;
  dispatch: (newState: Store.ProjectStore) => void;
}>({
  state: ProjectContextInitValue,
  dispatch: () => {},
});
