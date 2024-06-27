// src/components/LoginHandler.jsx
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const useLoginHandler = (setIsAuthenticated) => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      console.log('Login successful:', response.data);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
      alert("Usuário ou senha incorretos");
    }
  };

  return { handleLogin };
};

export default useLoginHandler;
