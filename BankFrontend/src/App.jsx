import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Root from "../Root.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
  return (
    <div className="w-full min-h-screen px-5 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-gray-100">
      <Router>
        <Routes>
          <Route path='' element={<Root />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
