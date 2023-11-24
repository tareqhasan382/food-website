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
  const [foods, setFoods] = useState<MenuItem[]>(data);
  const [activeFilter, setActiveFilter] = useState<string>("");
  // Filter by burgers/pizza/etc
  const filterType = (category: string) => {
    setFoods(
      data.filter((item) => {
        return item.category === category;
      })
    );
    setActiveFilter(category);
  };
  //  Filter by price
  // const filterPrice = (price: string) => {
  //   data.filter((item) => {
  //     return item.price === price;
  //   });
  // };
  // onClick={()=>filterPrice("$")}
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
            <button
              onClick={() => (setFoods(data), setActiveFilter(""))}
              className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                activeFilter === "" && " bg-orange-600 text-white "
              }`}
            >
              All
            </button>
            <button
              onClick={() => filterType("burger")}
              className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                activeFilter === "burger" && " active bg-orange-600 text-white "
              }`}
            >
              Burgers
            </button>
            <button
              onClick={() => filterType("pizza")}
              className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                activeFilter === "pizza" && " active bg-orange-600 text-white "
              }`}
            >
              Pizza
            </button>
            <button
              onClick={() => filterType("salads")}
              className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                activeFilter === "salads" && " active bg-orange-600 text-white "
              }`}
            >
              Salads
            </button>
            <button
              onClick={() => filterType("chiken")}
              className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                activeFilter === "chiken" && " active bg-orange-600 text-white "
              }`}
            >
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
            className=" relative border rounded-lg shadow-lg hover:scale-105 duration-300 "
          >
            <img
              className=" w-full h-[200px] object-cover rounded-t-lg  "
              src={item.Image}
              alt={item.name}
            />
            <div className=" px-2 flex justify-between py-4 ">
              <p className=" font-bold cursor-pointer">{item.name}</p>
              <p className=" absolute top-2 right-2">
                <span className=" bg-[#CC470A] text-white p-1 rounded-full ">
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
