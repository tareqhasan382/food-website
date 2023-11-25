import { MdFavorite } from "react-icons/md";
import { IoSearchCircle, IoCloseSharp } from "react-icons/io5";
import { FaShoppingCart, FaWallet, FaUserFriends } from "react-icons/fa";
import { IoIosHelpCircle, IoMdPricetags } from "react-icons/io";
import { BsFillFileArrowDownFill } from "react-icons/bs";
import { SiShopify } from "react-icons/si";
import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  // const [delivery, setDelivery] = useState<boolean>(true);
  // const [pickup, setPickup] = useState<boolean>(false);
  // const toggle = () => {};
  //md width: 768px || lg width: 1024px
  return (
    <div className=" fixed top-0 w-full z-20 bg-[#CC470A] max-w-[1640px] mx-auto flex justify-between items-center py-4 px-2 lg:px-20 ">
      {/* left side */}
      <div className="  flex items-center ">
        <div
          onClick={() => setOpen(!open)}
          className=" cursor-pointer flex items-center "
        >
          {/* <MdOutlineRestaurantMenu size={40} className=" font-bold " /> */}
          {/* hidden sm:flex */}
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl px-2 ">
            Best <span className=" font-bold  ">Eats</span>
          </h1>
        </div>

        <div className=" hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[14px] ">
          <p className=" bg-black text-white rounded-full p-1 px-2 cursor-pointer ">
            Delivery
          </p>
          <p className=" p-1 px-2 cursor-pointer ">Pickup</p>
        </div>
      </div>
      {/* search input || w-[200px] sm:w-[400px] lg:w-[500px] */}
      <div className=" flex items-center">
        <div className=" bg-gray-200 rounded-full flex items-center px-2">
          <IoSearchCircle size={30} className=" cursor-pointer " />
          <input
            type="text"
            placeholder="Search foods"
            className=" w-full bg-transparent p-2 focus:outline-none"
          />
        </div>
        {/* card button | /cart  */}
        <div className="ml-2 flex items-center">
          <Link to="/cart">
            <button className=" bg-black text-white rounded-full hidden sm:flex items-center py-2  ">
              <FaShoppingCart size={20} className=" mr-2 " /> Cart
            </button>
          </Link>
          <button className=" ml-2 lg:flex md:hidden bg-black text-white rounded-full hidden sm:flex items-center py-2  ">
            Log in
          </button>
        </div>
      </div>
      {/* Mobaile Menu ||  */}
      {/* Overlay */}
      {open && (
        <div className=" bg-black/50 fixed w-full h-screen z-10 top-0 left-0  duration-500"></div>
      )}

      {/* side drawer menu */}
      <div
        className={
          open
            ? "fixed top-0 left-0 w-[200px] h-screen bg-white z-10 duration-500"
            : "fixed top-0 left-[-100%] w-[200px] h-screen bg-white z-10 duration-500"
        }
      >
        <IoCloseSharp
          onClick={() => setOpen(!open)}
          size={40}
          className=" absolute right-4 cursor-pointer "
        />
        <Link to="/">
          <h2 className=" text-2xl p-4  ">
            Best <span className=" font-bold  ">Eats </span>
          </h2>
        </Link>
        <nav>
          <ul className=" flex flex-col p-4 text-gray-800 ">
            <Link to="/cart">
              <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300 ">
                <SiShopify size={20} className=" mr-2 " /> Orders
              </li>
            </Link>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <MdFavorite size={20} className=" mr-2 " /> Favorites
            </li>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <FaWallet size={20} className=" mr-2 " /> Wallet
            </li>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <IoIosHelpCircle size={20} className=" mr-2 " /> Help
            </li>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <IoMdPricetags size={20} className=" mr-2 " /> Promotions
            </li>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <BsFillFileArrowDownFill size={20} className=" mr-2 " /> Best One
            </li>
            <li className=" text-xl py-1 flex items-center cursor-pointer hover:text-rose-500 duration-300">
              <FaUserFriends size={20} className=" mr-2 " /> Invite Friends
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
