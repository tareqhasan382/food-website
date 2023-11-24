const Hero = () => {
  //px-2 lg:px-20
  return (
    <div className=" max-w-[1640px] mx-auto mt-[70px]  ">
      <div className=" max-h-[500px] relative ">
        {/* Delivery */}
        <div className=" absolute w-full h-full text-[#CC470A] max-h-[500px] flex flex-col pt-8 lg:px-20 ">
          <h1 className="px-4 text-xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold ">
            The <span className=" ">Best</span>
          </h1>
          <h1 className="px-4 text-xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ">
            Foods <span className=" ">Delivered</span>
          </h1>
        </div>
        <img
          className=" w-full max-h-[500px] object-fill "
          src="https://i.ibb.co/JvDPWzv/Red-Brown-Creative-Korean-Food-Promotion-Banner-1.jpg"
          alt="img"
        />
      </div>
    </div>
  );
};

export default Hero;
