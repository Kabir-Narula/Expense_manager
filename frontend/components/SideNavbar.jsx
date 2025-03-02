import "../src/App";
import { CgMenuGridO } from "react-icons/cg";
import { MdAttachMoney } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

const SideNavbar = () => {

    // useLocation hook will be used to apply conditional rendering 
    // on a link when the user is on that page. 
    const location = useLocation()

  return (
    <div className='bg-white h-screen p-5 pt-8 w-72 justify-between'>
      <div className='flex items-center flex-col '>
        <img
          className='w-30 h-30 rounded-full object-cover'
          src='https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
        />
        <h1 className='mt-8 text-lg'>Sean Muniz</h1>
      </div>
      <div>
        {/* Overview link */}
        <Link
          to='/'
          className={`flex items-center 
                    my-4 
                    rounded-xl
                     p-1 
                     ${location.pathname === "/" ? "bg-sky-200" : "bg-white"}`}
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
             ${location.pathname === "/income" ? "bg-sky-200" : "bg-white"}`}
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
             ${location.pathname === "/expenses" ? "bg-sky-200" : "bg-white"}`}
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
             ${location.pathname === "/logout" ? "bg-sky-200" : "bg-white"}`}
        >
          <RiLogoutBoxLine className='mr-5 size-10' />
          <h3>Log Out</h3>
        </Link>
      </div>
    </div>
  );
};
export default SideNavbar;
