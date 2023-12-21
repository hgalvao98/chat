import React from "react";
import ChatApp from "./pages/ChatApp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import "./styles/index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat/:name" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
