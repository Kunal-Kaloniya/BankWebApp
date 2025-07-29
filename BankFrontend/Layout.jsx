import { Outlet } from "react-router-dom";
import Header from "./src/components/Header";

function Layout() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
            <Header />
            <Outlet />
        </div>
    );
}

export default Layout;