import { BaseFooter, BaseHeader } from "./components/common";
import CategoryShop from "./components/features/homepage/CategoryShop";
import Hero from "./components/features/homepage/Hero";
import JoinAsSeller from "./components/features/homepage/JoinAsSeller";
import TrendyProducts from "./components/features/homepage/TrendyProducts";
import TopVendors from "./components/features/vendor/TopVendors";

const App = () => {
    return (
        <div>
            <BaseHeader />
            <Hero />
            <TrendyProducts />
            <CategoryShop />
            <JoinAsSeller />
            <TopVendors />
            <BaseFooter />
        </div>
    )
}

export default App;