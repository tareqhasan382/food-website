/* eslint-disable @typescript-eslint/no-explicit-any */
// YourComponent.js
import React, { useState } from "react";
import { useGetFoodsQuery } from "../redux/api/foodApi";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  Image: string;
  price: number;
}

const Food: React.FC = () => {
  const [limit] = useState<number>(10);
  const [page] = useState<number>(1);
  const [filterField, setFilterField] = useState<string>("");
  const [search] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [sortField, setSortField] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [activeSortFilter, setActiveSortFilter] = useState<string>("");

  const query: Record<string, any> = {
    limit,
    page,
    filterField,
    search,
    sortOrder,
    sortField,
  };

  const { data, isLoading } = useGetFoodsQuery(query);

  const food = data?.data;

  const filterType = (category: string) => {
    setFilterField(category);
    setActiveFilter(category);
  };
  const sortType = (payload: string) => {
    setSortField(payload);
    setActiveSortFilter(payload);
    setSortField(payload);
  };
  //  <button className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1">
  // $
  // </button>
  return (
    <>
      {isLoading ? (
        <div className="max-w-[1640px] m-auto px-2 py-12 lg:px-20">
          <h1 className="text-2xl font-bold">Loading</h1>
        </div>
      ) : (
        <div className="max-w-[1640px] m-auto px-2 py-12 lg:px-20">
          <h1 className="text-[#CC470A] font-bold text-3xl lg:text-4xl text-center mb-4">
            Top Rated Menu Items
          </h1>
          {/* Filter row */}
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <p className="font-bold text-gray-700">Filter Type</p>
              <div className="flex justify-between flex-wrap">
                <button
                  onClick={() => filterType("")}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeFilter === "" && "bg-orange-600 text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => filterType("pizza")}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeFilter === "pizza" &&
                    "active bg-orange-600 text-white"
                  }`}
                >
                  Pizza
                </button>
                <button
                  onClick={() => filterType("salads")}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeFilter === "salads" &&
                    "active bg-orange-600 text-white"
                  }`}
                >
                  Salads
                </button>
                <button
                  onClick={() => filterType("chiken")}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeFilter === "chiken" &&
                    "active bg-orange-600 text-white"
                  }`}
                >
                  Chiken
                </button>
                <button
                  onClick={() => filterType("burger")}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeFilter === "burger" &&
                    "active bg-orange-600 text-white"
                  }`}
                >
                  Burgers
                </button>
                {/* Add buttons for other filter types */}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-700">Filter By Sort</p>
              <div className="flex justify-between flex-wrap">
                <button
                  onClick={() => {
                    sortType("");
                    setSortOrder("");
                  }}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeSortFilter === "" && "bg-orange-600 text-white"
                  }`}
                >
                  Clear
                </button>
                {/* Add buttons for other filter price options || ?sortField=date&sortOrder=-1 || ascending, descending, 1, or -1 */}
                <button
                  onClick={() => {
                    sortType("price");
                    setSortOrder("-1");
                  }}
                  className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white m-1 ${
                    activeSortFilter === "price" && "bg-orange-600 text-white"
                  }`}
                >
                  Price
                </button>
              </div>
            </div>
          </div>
          {/* Display food Images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {food?.map((item: MenuItem) => (
              <div
                key={item._id}
                className="relative border rounded-lg shadow-lg hover:scale-105 duration-300"
              >
                <img
                  className="w-full h-[200px] object-cover rounded-t-lg"
                  src={item.Image}
                  alt={item.name}
                />
                <div className="px-2 flex justify-between py-4">
                  <p className="font-bold cursor-pointer">{item.name}</p>
                  <p className="absolute top-2 right-2">
                    <span className="bg-[#CC470A] text-white p-1 rounded-full">
                      {item.price}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Food;
