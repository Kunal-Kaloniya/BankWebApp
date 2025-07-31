import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import Layout from "../Layout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Transaction from "./Pages/Transaction.jsx";
import Admin from "./Pages/Admin.jsx";

function App() {

  const { user } = useContext(AuthContext);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-gray-100">
      <Router>
        <Routes>
          <Route path='' element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<Dashboard />} />
              <Route path="/user/transaction" element={<Transaction />} />
              <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to='/' />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
