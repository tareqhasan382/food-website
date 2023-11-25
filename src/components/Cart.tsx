//import { getFromLocalStorage } from "../utills/local-storage";
import { useAppSelector } from "../redux/hooks";
import Navbar from "./Navbar";
import { FaPlus, FaMinus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
interface IFood {
  _id: string;
  name: string;
  category: string;
  Image: string;
  price: number;
  quantity?: number;
}
const Cart: React.FC = () => {
  const { foods } = useAppSelector((state) => state.cart);
  // const cart = getFromLocalStorage("cart");
  console.log(foods);
  return (
    <div className="bg-gray-200">
      <div>
        <Navbar />
      </div>
      <div className="mx-auto mt-[70px] flex flex-col pt-8 lg:px-20 ">
        <h1 className=" text-center text-xl font-bold ">Cart Page</h1>

        <div className=" flex flex-col md:flex-row h-auto justify-between gap-6 w-full p-2 lg:px-20 ">
          {/*=============== single cart ===================*/}
          <div className=" h-auto flex flex-col w-full lg:w-1/2 gap-2 ">
            {foods.map((item: IFood) => (
              <div
                key={item._id}
                className=" bg-white duration-300 h-auto flex items-center justify-between outline rounded-md outline-1 outline-black "
              >
                <img
                  src="https://tse3.mm.bing.net/th?id=OIP.BEH8rpIxoiUt_AQDRmSYTAHaFY&pid=Api&P=0&h=220"
                  alt="img"
                  className=" w-[70px] h-[70px] pl-2 "
                />
                <div className=" flex flex-col ">
                  <p className="  ">
                    Name:{" "}
                    <span className=" font-bold ">Double Cheese Salads</span>
                  </p>
                  <p>
                    Price: <span className="text-base font-bold">$99</span>
                  </p>
                  <p>
                    quantity: <span className="text-base font-bold">2</span>
                  </p>
                </div>
                <div className="flex flex-col p-2 gap-1 ">
                  <FaPlus
                    size={30}
                    className=" cursor-pointer bg-[#CC470A] rounded-lg p-2  "
                  />
                  <FaMinus
                    size={30}
                    className=" cursor-pointer bg-[#CC470A] rounded-lg p-2  "
                  />
                  <RiDeleteBin5Fill
                    size={30}
                    className=" cursor-pointer bg-[#CC470A] rounded-lg p-2  "
                  />
                </div>
              </div>
            ))}
          </div>
          {/*==================== Order Now ====================*/}
          <div className=" top-0 lg:w-1/2 w-full">
            <div className=" relative top-0  flex flex-col text-lg items-center justify-center py-2 outline rounded-md outline-1 outline-black ">
              <p className=" ">Order Now</p>
              <p>
                Total: <span className=" font-bold ">$99</span>
              </p>
              <form
                action=""
                className=" px-2 lg:w-2/3 w-full flex flex-col gap-2 "
              >
                <input
                  type="text"
                  placeholder="your name"
                  className=" pl-2 w-full rounded-md h-10 focus:outline-none "
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  className=" pl-2 w-full rounded-md h-10 focus:outline-none "
                />
                <input
                  type="text"
                  placeholder="Adress"
                  className=" pl-2 w-full rounded-md h-10 focus:outline-none "
                />
                <button
                  disabled
                  className=" pl-2 w-full rounded-md h-10 font-bold hover:bg-black hover:text-white "
                >
                  Payment Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
