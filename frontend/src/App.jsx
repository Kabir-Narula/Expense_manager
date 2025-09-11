import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import SideNavbar from "../components/SideNavbar";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Logout from "../pages/Logout";
import Charts from "../pages/Charts";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import EditIncome from "../components/EditIncome";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="app-container">
      {showNavbar && <SideNavbar />}
      <div className={`main-content ${showNavbar ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-income" element={<EditIncome /> } />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;