import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { useIfm } from "@jswork/react-iframe-mate";

function App() {
  const navigate = useNavigate();
  useIfm({ navigate });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Site3 App</h3>
      </header>
    </div>
  );
}

export default App;
