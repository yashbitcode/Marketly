import { BaseFooter, BaseHeader } from "../components/common";
import Hero from "../components/features/homepage/Hero";
import TrendyProducts from "../components/features/homepage/TrendyProducts";
import CategoryShop from "../components/features/homepage/CategoryShop";
import JoinAsSeller from "../components/features/homepage/JoinAsSeller";
import TopVendors from "../components/features/vendor/TopVendors";

const Homepage = () => {
    return (
        <>
            <BaseHeader />
            <Hero />
            <TrendyProducts />
            <CategoryShop />
            <JoinAsSeller />
            <TopVendors />
            <BaseFooter />
        </>
    );
};

export default Homepage;