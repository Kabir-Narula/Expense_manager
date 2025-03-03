import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import SideNavbar from "../components/SideNavbar";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Logout from "../pages/Logout";
import Charts from "../pages/Charts"; // Import Charts Page

function App() {
  return (
    <Router>
      <SideNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/income" element={<Income />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/charts" element={<Charts />} /> {/* Added Charts Route */}
      </Routes>
    </Router>
  );
}

export default App;
