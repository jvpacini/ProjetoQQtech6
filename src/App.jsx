import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import UserDashboard from "./pages/UserDashboard";
import ModuleDashboard from "./pages/ModuleDashboard";
import TransactionDashboard from "./pages/TransactionDashboard";
import ProfileDashboard from "./pages/ProfileDashboard";
import FunctionDashboard from "./pages/FunctionDashboard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/users"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UserDashboard
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/modules"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ModuleDashboard
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <TransactionDashboard
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProfileDashboard
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/functions"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <FunctionDashboard
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard searchTerm={searchTerm} onSearch={setSearchTerm} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
