import Category from "./components/Category";
import Food from "./components/Food";
import Hero from "./components/Hero";
import HeroCards from "./components/HeroCards";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div>
        {/* <Navbar /> */}
        <Hero />
        <HeroCards />
        <Food />
        <Category />
      </div>
    </>
  );
}

export default App;
