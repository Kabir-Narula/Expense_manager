import "../src/App.css";
import { CgMenuGridO } from "react-icons/cg";
import { MdAttachMoney, MdBarChart } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLogoutBoxLine, RiDashboardLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const SideNavbar = () => {
  const location = useLocation();
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const sideNavBar = useRef(null);

  const [user, setUser] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavBar.current && !sideNavBar.current.contains(event.target)) {
        setIsSmallScreen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=> {
    fetch("http://localhost:8080/api/auth/67cd1588c8c7508d8eeb1596")
    .then((response) => response.json())
    .then((data) => {
      setUser(data.user);
      console.log(data);
    })
    .catch((error) => console.log("error fetching data: ", error));    
  },[])


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
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="flex items-center mb-12 ml-2">
            <RiDashboardLine className="w-8 h-8 text-indigo-400" />
            <span className="ml-3 text-xl font-semibold text-white">FinDashboard</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { to: '/', icon: <CgMenuGridO />, text: 'Dashboard' },
              { to: '/income', icon: <MdAttachMoney />, text: 'Income' },
              { to: '/expenses', icon: <FaHandHoldingUsd />, text: 'Expenses' },
              { to: '/charts', icon: <MdBarChart />, text: 'Analytics' },
              { to: '/logout', icon: <RiLogoutBoxLine />, text: 'Log Out' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-3.5 rounded-xl text-indigo-200 hover:bg-indigo-800 hover:text-white transition-all group ${
                  location.pathname === link.to ? "bg-indigo-800 text-white border-l-4 border-indigo-400" : ""
                }`}
              >
                <span className={`text-xl mr-4 group-hover:text-indigo-300 ${
                  location.pathname === link.to ? "text-indigo-300" : "text-indigo-400"
                }`}>
                  {link.icon}
                </span>
                <span className="text-sm font-medium tracking-wide">{link.text}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t border-indigo-700 pt-4">
          <div className="flex items-center px-2">
            <img
              className="w-10 h-10 rounded-full border-2 border-indigo-400"
              src={user.profileImageURL}
              alt="User profile"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.fullName}</p>
              <p className="text-xs text-indigo-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SideNavbar;