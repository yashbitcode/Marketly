import CategoryShop from "./components/features/homepage/CategoryShop";
import Header from "./components/features/homepage/Header";
import Hero from "./components/features/homepage/Hero";
import JoinAsSeller from "./components/features/homepage/JoinAsSeller";
import TrendyProducts from "./components/features/homepage/TrendyProducts";
import TopVendors from "./components/features/vendor/TopVendors";

const App = () => {
    return (
        <div>
            <Header />
            <Hero />
            <TrendyProducts />
            <CategoryShop />
            <JoinAsSeller />
            <TopVendors />
        </div>
    )
}

export default App;