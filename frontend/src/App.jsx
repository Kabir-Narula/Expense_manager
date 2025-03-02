// import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";


import SideNavbar from "../components/SideNavbar";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Logout from "../pages/Logout"; 


function App() {
  return (
    <Router>
      <div className="flex bg-stone-100">
        <SideNavbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
