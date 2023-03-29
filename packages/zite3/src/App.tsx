import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useIfm } from "@jswork/react-iframe-mate";

const Home = () => {
  return <h1>Home for site3 app</h1>;
};

const S3 = () => {
  return <h1>S3 for site3 app</h1>;
};

function App() {
  const navigate = useNavigate();
  useIfm({ navigate });
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h3>Site3 App</h3>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/s3">S3</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s3" element={<S3 />} />
      </Routes>
    </div>
  );
}

export default App;
