import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    const login = (userData) => {
        setUser(userData);
        setIsLogged(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLogged", true);
    }

    const logout = () => {
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isLogged");
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedIsLogged = JSON.parse(localStorage.getItem("isLogged"));

        if (storedUser) setUser(storedUser);
        if (storedIsLogged) setIsLogged(storedIsLogged);    

    }, []);

    return (
        <AuthContext.Provider value={{ user, isLogged, setUser, setIsLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}