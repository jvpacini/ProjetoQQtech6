import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ChangePasswordPage = styled.div`
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

const ChangePasswordBox = styled.div`
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

const Message = styled.p`
  color: red;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
`;

const SuccessMessage = styled.p`
  color: lightgreen;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
`;

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Token inválido ou expirado");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/recover-password/${token}`,
        { password: newPassword }
      );
      setMessage(response.data.message);
      setSuccess(true);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <ChangePasswordPage>
      <Container>
        <ChangePasswordBox>
          <Title>Redefinir Senha</Title>
          <Form onSubmit={handleSubmit}>
            <Label>Nova Senha</Label>
            <Input
              type="password"
              placeholder="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Label>Confirmar Senha</Label>
            <Input
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Enviar</Button>
          </Form>
          {message && <Message>{message}</Message>}
          {success && (
            <SuccessMessage>
              Senha trocada com sucesso!{" "}
              <span
                onClick={handleRedirect}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Clique aqui para ser redirecionado a pagina de Login
              </span>
            </SuccessMessage>
          )}
        </ChangePasswordBox>
      </Container>
    </ChangePasswordPage>
  );
};

export default ChangePassword;
