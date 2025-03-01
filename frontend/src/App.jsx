import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";


import SideNavbar from "../components/SideNavbar";
import Dashboard from "../components/Dashboard";
import Expenses from "../components/Expenses";
import Income from "../components/Income";
import Logout from "../components/Logout"; 


function App() {
  return (
    <Router>
      <div className="flex bg-stone-100">
        <SideNavbar />
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
