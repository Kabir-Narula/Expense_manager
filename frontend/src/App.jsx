import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

import SideNavbar from "../components/SideNavbar";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Logout from "../pages/Logout";
import Charts from "../pages/Charts";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import EditProfile from "../pages/EditProfile";
import ProtectedRoute from "../components/ProtectedRoutes";
import ManageAccount from "../pages/ManageAccount";

const App = () => {
  const location = useLocation();
  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="app-container">
      {showNavbar && <SideNavbar />}
      <div className={`main-content ${showNavbar ? "with-sidebar" : ""}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <Income />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/income/:year"
            element={
              <ProtectedRoute>
                <IncomeByYear />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-account"
            element={
              <ProtectedRoute>
                <ManageAccount />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
