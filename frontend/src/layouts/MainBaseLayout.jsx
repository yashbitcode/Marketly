import { Outlet } from "react-router"
import { BaseFooter, BaseHeader } from "../components/common";

const MainBaseLayout = () => {
    return (
        <>
            <BaseHeader />
            <Outlet />
            <BaseFooter />
        </>
    )
}

export default MainBaseLayout;