import { Outlet } from "react-router";
import { BaseFooter, BaseHeader } from "../components/common";

const MainBaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <BaseHeader />
            <Outlet />
            <BaseFooter />
        </div>
    );
};

export default MainBaseLayout;
