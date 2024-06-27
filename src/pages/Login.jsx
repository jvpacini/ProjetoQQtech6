import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { loginUser } from "../services/api"; // Import the API service

const LoginPage = styled.div`
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #19a751, #e1ad2a);
`;

const Container = styled.div`
  text-align: left;
`;

const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
`;

const LoginBox = styled.div`
  background-color: #f0fff7;
  padding: 30px 70px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
  position: relative;
`;

const Title = styled.h1`
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  margin-bottom: 20px;
  font-size: 42px;
  color: #333;
  position: relative;
  top: -10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Roboto", sans-serif;
  background-color: #ada8a8;
  &::placeholder {
    color: #333;
  }
`;

const ForgotPassword = styled.a`
  margin-bottom: 15px;
  color: #0066cc;
  text-decoration: none;
  font-size: 0.9em;
  align-self: flex-start;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #d9d9d9;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  width: 150px;
  align-self: flex-end;
  &:hover {
    background-color: #b0b0b0;
  }
`;

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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

  return (
    <LoginPage>
      <Container>
        <Logo src={logo} alt="Projeto BE-A-BA" />
        <LoginBox>
          <Title>Login</Title>
          <Form onSubmit={handleLogin}>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <ForgotPassword href="/forgot-password">
              Esqueceu a senha?
            </ForgotPassword>
            <Button type="submit">Login</Button>
          </Form>
        </LoginBox>
      </Container>
    </LoginPage>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
