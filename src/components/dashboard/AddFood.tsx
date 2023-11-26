// number  name , image , category , price

const AddFood = () => {
  return (
    <div>
      <h1>This is Add Food</h1>
      <div className=" bg-slate-300 items-start w-full h-full py-4 ">
        <div className=" w-[200px] h-full bg-gray-200 border border-black flex flex-col ">
          <div className=" z-10 bg-black text-white w-full h-20 items-center ">
            <h1 className=" fixed top-0 pt-6 text-center text-3xl font-bold ">
              Dash Boad
            </h1>
          </div>
          {/* overflow-y-scroll */}
          <div className=" pl-3 pt-40 h-full w-full flex flex-col gap-6 overflow-ellipsis pb-80 ">
            <div className="  ">
              <button>Add Food</button>
            </div>
            <div className="  ">
              <button>Add Food</button>
            </div>
            <div className="  ">
              <button>Add Food</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
