import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Registration";
import TaskManager from "./components/TaskManager";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="max-h-screen">
          <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-white text-lg font-bold">Taskier</div>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    to="/"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TaskManager />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
