import Hero from "./components/Hero";
import HeroCards from "./components/HeroCards";
import Category from "./components/Category";
import TopRatedSection from "./components/food/TopRatedSection";

const App: React.FC = () => (
  <>
    <Hero />
    <HeroCards />
    <Category />
    <TopRatedSection />
  </>
);

export default App; 
