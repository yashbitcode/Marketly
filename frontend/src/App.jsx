import CategoryShop from "./components/features/hompage/CategoryShop";
import Header from "./components/features/Hompage/Header";
import Hero from "./components/features/Hompage/Hero";
import TrendyProducts from "./components/features/hompage/TrendyProducts";

const App = () => {
    return (
        <div>
            <Header />
            <Hero />
            <TrendyProducts />
            <CategoryShop />
        </div>
    )
}

export default App;