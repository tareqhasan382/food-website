import { data } from "../data/data";
import { useState } from "react";
interface MenuItem {
  id: number;
  name: string;
  category: string;
  Image: string;
  price: string;
}
//   interface MenuListProps {
//     data: MenuItem[];
//   }
const Food: React.FC = () => {
  //console.log(data);
  const [foods] = useState<MenuItem[]>(data);

  return (
    <div className=" max-w-[1640px] m-auto px-2 py-12 lg:px-20  ">
      <h1 className=" text-[#CC470A] font-bold text-3xl lg:text-4xl text-center mb-4 ">
        Top Rated Menu Items
      </h1>
      {/* Filter row */}
      <div className=" flex flex-col lg:flex-row justify-between ">
        <div className=" ">
          {/* filter type */}
          <p className=" font-bold text-gray-700  ">Filter Type</p>
          <div className=" flex justify-between flex-wrap ">
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              All
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              Burgers
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              Pizza
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              Salads
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              Chiken
            </button>
          </div>
        </div>
        <div className="">
          {/* filter price */}
          <p className=" font-bold text-gray-700  ">Filter Price</p>
          <div className=" flex justify-between flex-wrap ">
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              $
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              $$
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              $$$
            </button>
            <button className=" border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ">
              $$$$
            </button>
          </div>
        </div>
      </div>
      {/* display food Images */}
      <div className=" grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 ">
        {foods.map((item: MenuItem) => (
          <div
            key={item.id}
            className=" border rounded-lg shadow-lg hover:scale-105 duration-300 "
          >
            <img
              className=" w-full h-[200px] object-cover rounded-t-lg  "
              src={item.Image}
              alt={item.name}
            />
            <div className=" px-2 flex justify-between py-4 ">
              <p className=" font-bold ">{item.name}</p>
              <p>
                <span className=" bg-orange-500 text-white p-1 rounded-full ">
                  {item.price}{" "}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
