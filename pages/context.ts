import React from "react";

export const AppContextInitValue: { accounts: Account[] } = { accounts: [] };
export const AppContext = React.createContext(AppContextInitValue);

// 项目
export const ProjectContextInitValue: Store.ProjectStore = {
  type: "normal",
  payload: {
    address: "",
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

// 投资
export const investmenContextInitValue: Store.InvestmentStore = {
  type: "normal",
  payload: [],
};
export const investmenContext = React.createContext<{
  state: Store.InvestmentStore;
  dispatch: (newState: Store.InvestmentStore) => void;
}>({
  state: investmenContextInitValue,
  dispatch: () => {},
});

// 支出
export const payContextInitValue: Store.payStore = {
  type: "normal",
  payload: {
    list: [],
  },
};
export const payContext = React.createContext<{
  state: Store.payStore;
  dispatch: (newState: Store.payStore) => void;
}>({
  state: payContextInitValue,
  dispatch: () => {},
});
