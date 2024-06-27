import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

const useLogoutHandler = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get("accessToken") !== undefined
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    Cookies.remove("accessToken"); // Clear the access token cookie
    navigate("/login");
    console.log("Logout successful");
  };

  return { handleLogout, isAuthenticated };
};

export default useLogoutHandler;
