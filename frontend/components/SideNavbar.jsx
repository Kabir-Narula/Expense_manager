import "../src/App";
import "../src/App.css"
import { CgMenuGridO } from "react-icons/cg";
import { MdAttachMoney } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { RiTailwindCssFill } from "react-icons/ri";
import { FiMenu } from "react-icons/fi"; // Hamburger icon
import { useState, useRef, useEffect } from "react";



const SideNavbar = () => {

    // useLocation hook will be used to apply conditional rendering 
    // on a link when the user is on that page. 
    const location = useLocation()

    const [isSmallScreen, setIsSmallScreen] = useState(true)

    const sideNavBar = useRef(null);

    // this will close the sidebar when clicking outside of it
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sideNavBar.current && !sideNavBar.current.contains(event.target)) {
          setIsSmallScreen(false); // Close the sidebar if click is outside
        }
      };
      
      // Add event listener for clicks
      document.addEventListener("mousedown", handleClickOutside);
  
      // Clean up the event listener when the component is unmounted
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

  return (
    <>
    {/* 'fixed' ensures that the button stays in the same position when scrolling
          'md:hidden ensures that the button is hidden when the screen is larger than medium 
          
          ${isSmallScreen ? "hidden" : "md:hidden"

          for that code above, understand that if isSmallScreen is true, the hamburger menu button will be completely hidden. 
          however, if it is false, then the the hamburger menu will only be hidden if the screen is md or more. In other words, 
          it will only appear for screens smaller than md (small screen). 

          */}
    <button className={`fixed m-5 text-white bg-indigo-600 p-2 rounded-md md:hidden z-50 ${isSmallScreen ? "hidden" : "md:hidden"}`} onClick={()=>{setIsSmallScreen(!isSmallScreen)}}>
      <FiMenu className="w-8 h-8" />
    </button>


    <div className={`bg-indigo-600 
                    h-screen p-5 
                    fixed
                    w-72 
                    pt-5 
                    flex 
                    flex-col 
                    justify-between 
                    transition-transform duration-300
                    md:m-5 
                    ${isSmallScreen ? "translate-x-0 rounded-none" : "-translate-x-full md:translate-x-0 sm:rounded-l-lg md:rounded-l-lg"}`}
                    ref={sideNavBar}>
      <div>
      {/* Logo */}
      <RiTailwindCssFill className="w-12 h-12 mb-10 fill-white"/>
      
        {/* Overview link */}
        <Link
          to='/'
          className={`flex items-center 
                    my-4 
                    rounded-xl
                     p-1 
                    text-indigo-200
                     ${location.pathname === "/" ? "bg-indigo-700 text-white" : ""}`}
        >
          <CgMenuGridO className='mr-5 size-10' />
          <h3>Dashboard</h3>
        </Link>

        {/* Income */}
        <Link
          to='/income'
          className={`flex items-center 
            my-4 
            rounded-xl
             p-1 
             text-indigo-200
             ${location.pathname === "/income" ? "bg-indigo-700 text-white" : ""}`}
        >
          <MdAttachMoney className='mr-5  size-10' />
          <h3>Income</h3>
        </Link>
        {/* Expenses */}
        <Link
          to='/expenses'
          className={`flex items-center 
            my-4 
            rounded-xl
             p-1 
             text-indigo-200
             ${location.pathname === "/expenses" ? "bg-indigo-700 text-white" : ""}`}
        >
          <FaHandHoldingUsd className='mr-5 size-10' />
          <h3>Expenses</h3>
        </Link>
        {/* logout */}
        <Link
          to='/logout'
          className={`flex items-center 
            my-4 
            rounded-xl
             p-1 
             text-indigo-200
             ${location.pathname === "/logout" ? "bg-indigo-700 text-white" : ""}`}
        >
          <RiLogoutBoxLine className='mr-5 size-10' />
          <h3>Log Out</h3>
        </Link>
      </div>
      <div className="flex items-center">
        <img
            className='w-12 h-12 rounded-full object-cover mr-5'
            src='https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
          />
          <h1 className='text-white'>Sean Muniz</h1>
      </div>
    </div>
    </>
  );
};
export default SideNavbar;