import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
const Dashboard = () => {
  return (
    <div className=" px-2 lg:px-20 max-w-[1640px] min-h-screen w-full pt-10  ">
      {/* fixed top-0 h-full w-full  bg-[#CC470A] max-w-[1640px] mx-auto flex justify-between items-center */}
      <div className=" flex flex-row gap-6 ">
        {/*============ cotainer Box =============*/}
        {/*============ left Box =============*/}
        <div className=" min-w-[200px] rounded-md h-screen bg-rose-200 border border-black flex flex-col">
          <div className=" px-4 flex flex-col items-center justify-center gap-4 ">
            <Link to="/dashboard">
              <h1 className=" text-4xl font-bold ">DashBoard</h1>
            </Link>
            <Link to="/dashboard/add">
              <button className=" w-[180px] ">Add Food</button>
            </Link>
            <Link to="/dashboard">
              <button className=" w-[180px] ">Update Food</button>
            </Link>
          </div>
        </div>
        {/*============ right Box =============*/}
        <div className=" w-full bg-green-400 items-center py-4 rounded-md justify-center ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
