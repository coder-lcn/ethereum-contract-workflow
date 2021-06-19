import React from "react";

const AppContextInitValue: { accounts: Account[] } = { accounts: [] };
export const AppContext = React.createContext(AppContextInitValue);
