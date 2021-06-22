import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import React, { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { ProjestList } from "./components/ProjectList";
import { AppContext } from "./context";
import { useAccounts } from "./hooks/useAccounts";
import { Container } from "./index.styled";
import Provider from "./store";

const App = () => {
  const accounts = useAccounts();
  const projectList = useMemo(() => <ProjestList />, []);

  return (
    <AppContext.Provider value={{ account: accounts.length ? accounts[0].account : "", accounts }}>
      <Provider>
        <ConfigProvider locale={zhCN}>
          <Container>
            <Navbar />
            {projectList}
          </Container>
        </ConfigProvider>
      </Provider>
    </AppContext.Provider>
  );
};

export default App;
