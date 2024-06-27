import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginUser } from "../services/api";

const useLoginHandler = (setIsAuthenticated) => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      console.log("Login successful:", response.data);
      setIsAuthenticated(true);
      Cookies.set("accessToken", response.data.token, { expires: 1/24 }); // Store the token as a cookie for 1 hour
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Usuário ou senha incorretos");
    }
  };

  return { handleLogin };
};

export default useLoginHandler;
