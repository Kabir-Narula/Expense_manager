import "../src/App";
import { CgMenuGridO } from "react-icons/cg";
import { MdAttachMoney } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const SideNavbar = () => {
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
          to='/dashboard'
          className='hover:bg-sky-200 flex items-center my-4 rounded-xl p-1'
        >
          <CgMenuGridO className='mr-5 size-10' />
          <h3>Dashboard</h3>
        </Link>

        {/* Income */}
        <Link
          to='/income'
          className='hover:bg-sky-200 flex items-center my-4 rounded-xl p-1'
        >
          <MdAttachMoney className='mr-5  size-10' />
          <h3>Income</h3>
        </Link>
        {/* Expenses */}
        <Link
          to='/expenses'
          className='hover:bg-sky-200 flex items-center my-4 rounded-xl p-1'
        >
          <FaHandHoldingUsd className='mr-5 size-10' />
          <h3>Expenses</h3>
        </Link>
        {/* logout */}
        <Link
          to='/logout'
          className='hover:bg-sky-200 flex items-center my-4 rounded-xl p-1'
        >
          <RiLogoutBoxLine className='mr-5 size-10' />
          <h3>Log Out</h3>
        </Link>
      </div>
    </div>
  );
};
export default SideNavbar;
