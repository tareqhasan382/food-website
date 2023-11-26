/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteFoodMutation,
  useGetFoodsQuery,
} from "../../redux/api/foodApi";
// import { useAppDispatch } from "../../redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { IoEye } from "react-icons/io5";
interface MenuItem {
  _id: string;
  name: string;
  category: string;
  Image: string;
  price: number;
}
const AllFood: React.FC = () => {
  // const dispatch = useAppDispatch();
  const [limit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const query: Record<string, any> = {
    limit,
    page,
    search,
  };

  const { data, isLoading } = useGetFoodsQuery({ ...query });
  // ===========delete food===================
  const [deleteFood] = useDeleteFoodMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteFood(id);
      toast.error("Delete Food Successfully", { icon: false });
    } catch (error) {
      toast.error("Error deleting product");
      // console.error("Error deleting product:", error);
    }
  };
  //=================pagination===================================
  const totalPage = Math.ceil(data?.meta?.total / limit);
  console.log("totalPage:", totalPage);
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      toast.warning("Page number can't be less than 1");
    }
  };
  const nextPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
    } else {
      toast.warning("Page number can't be more than");
    }
  };
  //=================pagination======================================
  const food = data?.data;
  //const meta = data?.meta;
  const tablebg = "hover:bg-gray-200 text-black";
  return (
    <div className=" flex items-center justify-center w-full ">
      <div className=" w-full px-4 lg:px-24 flex flex-col  justify-between gap-5 ">
        <div className=" w-full flex flex-row justify-between ">
          <h1 className=" text-xl font-bold ">All Foods</h1>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Enter food name"
            className="rounded-full font-xl h-10 focus:outline-none px-4 "
          />
        </div>
        {/*============================= Table ================================*/}
        <div>
          <div>
            <table className=" h-[400px] overflow-hidden shadow-2xl  rounded w-full ">
              <thead className=" w-full  text-white ">
                <tr className="">
                  <th className=" py-3 bg-cyan-800 ">S.NO</th>
                  <th className=" py-3 bg-cyan-800 ">Name</th>
                  <th className=" py-3 bg-cyan-800 ">Category</th>
                  <th className=" py-3 bg-cyan-800 ">Price</th>
                  <th className=" py-3 bg-cyan-800 ">Action</th>
                </tr>
              </thead>
              <tbody className=" text-black text-center  ">
                {food?.map((item: MenuItem, index: number) => (
                  <tr
                    key={item._id}
                    className={`${tablebg} h-4  text-black cursor-pointer duration-300 `}
                  >
                    {/* hover:scale-105 */}
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category} </td>
                    <td>{item.price}$ </td>

                    <td className=" gap-3 ">
                      <button className=" px-2 hover:text-green-700  border-none  ">
                        <BiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className=" px-2 hover:text-rose-700 border-none"
                      >
                        <MdDelete size={20} className=" text-red-700 " />
                      </button>
                      <button className=" px-2 hover:text-green-700 border-none">
                        <IoEye size={20} className="  " />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*====================== Pagination ============================*/}
          <div className="  py-2 border-black text-black items-center text-center ">
            <div className=" flex bg-gray-300 rounded-lg p-6  ">
              <button
                onClick={prevPage}
                className=" h-12 border-2 border-gray-600 px-4 rounded-l-lg hover:bg-gray-600 hover:text-white mr-2  "
              >
                <h3 className=" text-xl font-medium ">Prev</h3>
              </button>
              <button className=" h-12  px-4 rounded-lg  mr-2  ">
                {isLoading ? (
                  <h3 className=" text-xl font-medium ">100/99</h3>
                ) : (
                  <h3 className=" text-xl font-medium ">
                    {page}/{totalPage}
                  </h3>
                )}
              </button>
              <button
                onClick={nextPage}
                className=" h-12 border-2 border-gray-600 px-4 rounded-r-lg hover:bg-gray-600 hover:text-white mr-2  "
              >
                <h3 className=" text-xl font-medium ">Next</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFood;
