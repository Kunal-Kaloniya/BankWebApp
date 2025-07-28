import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auth/register', form);
            setMessage("User registered successfully!");
            setForm({ username: "", email: "", password: "" });
            navigate('/auth/login');
        } catch (err) {
            setMessage(err.message);
            console.error("Unable to Register!", err);
        }
    }

    return (
        <div className="w-full flex justify-center my-10">
            <div className="text-center">
                <h1 className="text-3xl font-medium mb-5">Register</h1>
                <form className="w-md min-h-10 px-5 py-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md flex flex-col" onSubmit={handleRegister}>
                    <label htmlFor="username" className="text-left">Username: </label>
                    <input
                        id="username"
                        name="username"
                        value={form.username}
                        type="text"
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-slate-700 h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                    />

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
                        Register
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

export default Register;