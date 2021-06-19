import React, { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { ProjestList } from "./components/ProjectList";
import { AppContext } from "./context";
import { useAccounts } from "./hooks/useAccounts";
import { Container } from "./index.styled";

const App = () => {
  const accounts = useAccounts();

  const projectList = useMemo(() => <ProjestList />, []);

  return (
    <AppContext.Provider value={{ accounts }}>
      <Container>
        <Navbar />
        {projectList}
      </Container>
    </AppContext.Provider>
  );
};

export default App;
