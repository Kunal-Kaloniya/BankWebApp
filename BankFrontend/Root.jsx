import { Outlet } from "react-router-dom";
import Header from "./src/components/Header";

function Root() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default Root;