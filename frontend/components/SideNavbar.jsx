import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import api from "../src/Utils/api";
import { FiMenu } from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { MdAttachMoney, MdBarChart, MdPerson } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLogoutBoxLine, RiDashboardLine } from "react-icons/ri";
// import defaultAvatar from "../assets/default-avatar.png";
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjMwIiBmaWxsPSIjNjY2NjY2Ij5VU0VSPC90ZXh0Pjwvc3ZnPg==";

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const sideNavBar = useRef(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/getUser");
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavBar.current && !sideNavBar.current.contains(event.target)) {
        setIsSmallScreen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for profile updates from other components, and does real-time updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log("SideNavbar received profile update:", event.detail);
      setUser(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <>
      <button
        className={`fixed top-5 left-5 z-50 p-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 shadow-lg transition-all md:hidden ${
          isSmallScreen ? "hidden" : "md:hidden"
        }`}
        onClick={() => setIsSmallScreen(!isSmallScreen)}
      >
        <FiMenu className="w-6 h-6 text-white" />
      </button>

      <div
        ref={sideNavBar}
        className={`bg-indigo-900 h-screen p-6 fixed w-72 flex flex-col justify-between transition-all duration-300 ${
          isSmallScreen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
      >
        <div>
          <div className="flex items-center mb-12 ml-2">
            <RiDashboardLine className="w-8 h-8 text-indigo-400" />
            <span className="ml-3 text-xl font-semibold text-white">FinDashboard</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { to: "/dashboard", icon: <CgMenuGridO />, text: "Dashboard" },
              { to: "/income", icon: <MdAttachMoney />, text: "Income" },
              { to: "/expenses", icon: <FaHandHoldingUsd />, text: "Expenses" },
              { to: "/charts", icon: <MdBarChart />, text: "Analytics" },
              { to: "/edit-profile", icon: <MdPerson />, text: "Edit Profile" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-3.5 rounded-xl text-indigo-200 hover:bg-indigo-800 hover:text-white transition-all group ${
                  location.pathname === link.to ? "bg-indigo-800 text-white border-l-4 border-indigo-400" : ""
                }`}
              >
                <span
                  className={`text-xl mr-4 group-hover:text-indigo-300 ${
                    location.pathname === link.to ? "text-indigo-300" : "text-indigo-400"
                  }`}
                >
                  {link.icon}
                </span>
                <span className="text-sm font-medium tracking-wide">{link.text}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3.5 rounded-xl text-indigo-200 hover:bg-indigo-800 hover:text-white transition-all group"
            >
              <span className="text-xl mr-4 group-hover:text-indigo-300 text-indigo-400">
                <RiLogoutBoxLine />
              </span>
              <span className="text-sm font-medium tracking-wide">Log Out</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-indigo-700 pt-4">
          {!loading && (
            <div className="flex items-center px-2">
              <img
                className="w-10 h-10 rounded-full border-2 border-indigo-400"
                src={user.profileImageURL ? `http://localhost:8000${user.profileImageURL}` : defaultAvatar}
                alt="User profile"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.fullName || "Guest User"}</p>
                <p className="text-xs text-indigo-400">{user.email || "user@example.com"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
