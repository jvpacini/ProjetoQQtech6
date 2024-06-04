import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png"; // Atualize o caminho conforme necessário

const ForgotPasswordPage = styled.div`
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

const ForgotPasswordBox = styled.div`
  background-color: #f0fff7;
  padding: 30px 70px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px; /* Aumentar a largura para 600px */
  position: relative;
`;

const Title = styled.h1`
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  margin-bottom: 1px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
  &:hover {
    background-color: #b0b0b0;
  }
`;

const Message = styled.p`
  font-size: 16px;
  color: green;
  margin-top: 1px;
  text-align: center;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o link de recuperação de senha
    setMessage("Link de recuperação enviado com sucesso!");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <ForgotPasswordPage>
      <Container>
        <Logo src={logo} alt="Projeto BE-A-BA" />
        <ForgotPasswordBox>
          <Title>Recuperação de senha</Title>
          <Form onSubmit={handleSubmit}>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {message && <Message>{message}</Message>}
            <ButtonContainer>
              <Button type="button" onClick={handleBackToLogin}>
                Voltar
              </Button>
              <Button type="submit">Confirmar</Button>
            </ButtonContainer>
          </Form>
        </ForgotPasswordBox>
      </Container>
    </ForgotPasswordPage>
  );
};

export default ForgotPassword;
