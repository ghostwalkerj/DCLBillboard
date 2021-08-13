import "./App.css";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { Symfoni } from "./hardhat/SymfoniContext";
import React from "react";

function App() {
  return (
    <Symfoni
      autoInit={true}
      loadingComponent={
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>}
    >
      <Navbar />
      <Main />
    </Symfoni>
  );
}

export default App;
