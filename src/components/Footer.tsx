const Footer = () => {
  return (
    <div>
      <div className="max-w-[1640px] h-full bg-slate-900 bottom-0 min-h-full m-auto px-2 pt-12 lg:px-20">
        <footer className=" text-white py-24">
          <div className="container mx-auto flex flex-col lg:flex-row gap-10  justify-between items-center">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-wider">
                Best<span className="text-[#CC470A]">Eats</span>
              </h1>
              <p className="mt-2 text-sm">Discover, Order, Enjoy!</p>
            </div>

            <div className="flex items-center flex-col text-center">
              <h2 className="text-lg font-bold mb-2">Follow Us</h2>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="text-xl hover:text-[#CC470A] transition duration-300"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-xl hover:text-[#CC470A] transition duration-300"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-xl hover:text-[#CC470A] transition duration-300"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="lg:text-right text-center ">
              <h2 className="text-lg font-bold mb-2">Contact Us</h2>
              <p className="text-sm">support@foodieapp.com</p>
              <p className="text-sm">1-800-FOOD-APP</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
