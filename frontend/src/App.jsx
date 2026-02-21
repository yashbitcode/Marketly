import { BaseFooter, BaseHeader } from "./components/common";
import ForgotPassword from "./components/features/auth/ForgotPassword";
import Login from "./components/features/auth/Login";
import Register from "./components/features/auth/register";
import ResetPassword from "./components/features/auth/ResetPassword";
import CategoryShop from "./components/features/homepage/CategoryShop";
import Hero from "./components/features/homepage/Hero";
import JoinAsSeller from "./components/features/homepage/JoinAsSeller";
import TrendyProducts from "./components/features/homepage/TrendyProducts";
import TopVendors from "./components/features/vendor/TopVendors";

const App = () => {
    return (
        <div>
            {/* <BaseHeader />
            <Hero />
            <TrendyProducts />
            <CategoryShop />
            <JoinAsSeller />
            <TopVendors />
            <BaseFooter /> */}
            {/* <Login choice={"user"} />
            <Register />
            <ForgotPassword /> */}
            {/* <ResetPassword /> */}
        </div>
    )
}

export default App;