import { categorys } from "../data/data";
import { useState } from "react";
interface MenuItem {
  id: number;
  name: string;
  category: string;
  Image: string;
  price: string;
}
const Category: React.FC = () => {
  const [category] = useState<MenuItem[]>(categorys); // setCategory
  return (
    <div className=" max-w-[1640px] m-auto px-2 py-12 lg:px-20 ">
      <h1 className=" text-[#CC470A] font-bold text-3xl lg:text-4xl text-center mb-4 ">
        Top Rated Category
      </h1>
      {/* Categorys || flex flex-wrap */}
      <div className=" grid grid-cols-2 md:grid-cols-4 py-6  gap-4 items-center justify-center">
        {category.map((item: MenuItem) => (
          <div
            key={item.id}
            className=" bg-[#CC470A] rounded-lg gap-2 flex justify-between items-center p-4 "
          >
            <h1 className=" sm:text-xl  font-bold text-center text-white ">
              {item.name}
            </h1>
            <img
              className=" rounded-lg w-20 object-cover "
              src={item.Image}
              alt={item.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
// rounded-b-lg w-[400px] h-[200px] object-cover
