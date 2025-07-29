import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx"

import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";

function Header() {

    const navigate = useNavigate();
    const { isLogged, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <div className="w-full h-[10vh] px-5 py-2">
            <div className="w-full h-full bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-100 border border-gray-500 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-between mt-3 px-5">
                <h1 className="font-medium text-lg hover:cursor-pointer" onClick={() => navigate('/')}>YourBank</h1>

                {
                    isLogged ? (
                        <>
                            <div className="flex gap-5">
                                <Link
                                    to='/'
                                    className="text-blue-600 dark:text-blue-500 focus:border-b-1 pb-1"
                                >
                                    Home
                                </Link>
                                <Link
                                    to='/user/dashboard'
                                    className="text-blue-600 dark:text-blue-500 focus:border-b-1 pb-1"
                                >
                                    Dashboard
                                </Link>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-500 dark:border-slate-700"
                                    onClick={() => toggleTheme()}
                                >
                                    {theme === "light" ? <MdDarkMode /> : <MdOutlineLightMode />}
                                </button>
                                <button
                                    className="px-5 py-2 rounded-full border border-red-800 bg-red-800 hover:bg-red-600 text-white transition-all duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-between gap-2">
                            <button
                                className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-500 dark:border-slate-700"
                                onClick={() => toggleTheme()}
                            >
                                {theme === "light" ? <MdDarkMode /> : <MdOutlineLightMode />}
                            </button>
                            <button
                                className="px-5 py-2 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-500 dark:border-slate-700" onClick={() => navigate('/register')}
                            >
                                Register
                            </button>
                            <button
                                className="px-5 py-2 rounded-full border border-blue-900 bg-blue-900 hover:bg-blue-700 text-white transition-all duration-300"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Header;