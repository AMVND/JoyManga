import React from "react";
import './App.css';
import Global from "./styles/global";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NavigationBar from "./Components/NavigationBar";


function App() {
  return (
    <BrowserRouter>
      <Global />
      <NavigationBar/>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;