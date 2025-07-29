import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auth/login', form);
            login({
                id: response.data.user._id,
                username: response.data.user.username,
                email: response.data.user.email,
                role: response.data.user.role
            });

            setMessage(response.data.message);
            localStorage.setItem("token", response.data.token);
            setForm({ email: "", password: "" });
            navigate('/user/dashboard')
        } catch (err) {
            setMessage(err.message);
            console.error("Login failed!", err);
        }
    }

    return (
        <div className="w-full min-h-[60vh] flex items-center justify-center my-10">
            <div className="text-center">
                <h1 className="text-3xl font-medium mb-5">Login</h1>
                <form className="w-md min-h-10 px-5 py-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md flex flex-col" onSubmit={handleLogin}>

                    <label htmlFor="email" className="text-left">E-mail: </label>
                    <input
                        id="email"
                        name="email"
                        value={form.email}
                        type="email"
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-slate-700 h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                    />

                    <label htmlFor="password" className="text-left">Password: </label>
                    <input
                        id="password"
                        name="password"
                        value={form.password}
                        type="password"
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-slate-700 h-10 mb-5 rounded text-center outline-0 border border-gray-500"
                    />

                    <button
                        className="px-5 py-2 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-500 dark:border-slate-700 hover:bg-slate-700 hover:text-white hover:dark:bg-gray-100 hover:dark:text-gray-900 transition-all"
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                {
                    message && (
                        <h1>{message}</h1>
                    )
                }
            </div>
        </div>
    );
}

export default Login;