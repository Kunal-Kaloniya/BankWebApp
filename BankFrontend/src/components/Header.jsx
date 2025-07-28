import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate();

    return (
        <div className="w-full h-[10vh] py-2">
            <div className="w-full h-full bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-100 border border-gray-500 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-between px-5">
                <h1 className="font-medium text-lg">YourBank</h1>

                <div>
                    <Link
                        to='/'
                        className="text-blue-600 dark:text-blue-500 focus:border-b-1 pb-1"
                    >
                        Home
                    </Link>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <button
                        className="px-5 py-2 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-500 dark:border-slate-700" onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                    <button
                        className="px-5 py-2 rounded-full border bg-blue-900 text-white"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;