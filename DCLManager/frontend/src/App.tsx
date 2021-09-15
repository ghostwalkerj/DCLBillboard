import "./App.css";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { Symfoni } from "./hardhat/SymfoniContext";
import React from "react";
import { RoleProvider } from "context/RoleContext";

function App() {
  return (
    <Symfoni
      autoInit={true}
      loadingComponent={
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      }
    >
      <Navbar/>
      <RoleProvider>
        <Main/>
      </RoleProvider>
    </Symfoni>
  );
}

export default App;
