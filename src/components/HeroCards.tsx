const HeroCards = () => {
  return (
    <div className=" max-w-[1640px] mx-auto grid md:grid-cols-3 gap-6  py-4 px-2 lg:px-20">
      {/* Card */}
      <div className=" rounded-xl relative ">
        {/* Delivery */}
        <div className=" absolute w-full h-full bg-black/50 rounded-xl text-white ">
          <p className=" font-bold text-2xl px-2 pt-4 ">
            Sun's Out. BUGO's Out
          </p>
          <p className=" px-2 ">Throught 8/26</p>
          <button className=" border-white bg-white text-black mx-2 absolute bottom-4 ">
            Order Now
          </button>
        </div>
        <img
          className=" max-h-[200px] md:h-[200px] w-full object-cover rounded-xl "
          src="https://i.ibb.co/BjhYmqg/Brown-Simple-Restaurant-Special-Menu-Promotion-Card.jpg"
          alt="img"
        />
      </div>
      <div className=" rounded-xl relative ">
        {/* Delivery */}
        <div className=" absolute w-full h-full bg-black/50 rounded-xl text-white ">
          <p className=" font-bold text-2xl px-2 pt-4 ">
            Sun's Out. BUGO's Out
          </p>
          <p className=" px-2 ">Throught 8/26</p>
          <button className=" border-white bg-white text-black mx-2 absolute bottom-4 ">
            Order Now
          </button>
        </div>
        <img
          className=" max-h-[200px] md:h-[200px] w-full object-cover rounded-xl "
          src="https://i.ibb.co/0QXhPwB/Brown-Simple-Restaurant-Special-Menu-Promotion-Card-1.jpg"
          alt="img"
        />
      </div>
      <div className=" rounded-xl relative ">
        {/* Delivery */}
        <div className=" absolute w-full h-full bg-black/50 rounded-xl text-white ">
          <p className=" font-bold text-2xl px-2 pt-4 ">
            Sun's Out. BUGO's Out
          </p>
          <p className=" px-2 ">Throught 8/26</p>
          <button className=" border-white bg-white text-black mx-2 absolute bottom-4 ">
            Order Now
          </button>
        </div>
        <img
          className=" max-h-[200px] md:h-[200px] w-full object-cover rounded-xl "
          src="https://i.ibb.co/BjhYmqg/Brown-Simple-Restaurant-Special-Menu-Promotion-Card.jpg"
          alt="img"
        />
      </div>
    </div>
  );
};

export default HeroCards;
// https://i.ibb.co/BjhYmqg/Brown-Simple-Restaurant-Special-Menu-Promotion-Card.jpg
// https://i.ibb.co/0QXhPwB/Brown-Simple-Restaurant-Special-Menu-Promotion-Card-1.jpg
