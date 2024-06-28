import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const ForgotPasswordBox = styled.div`
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/send-recovery-email', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <ForgotPasswordPage>
      <Container>
        <ForgotPasswordBox>
          <Title>Recuperar Senha</Title>
          <Form onSubmit={handleSubmit}>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Enviar</Button>
          </Form>
          {message && <p>{message}</p>}
        </ForgotPasswordBox>
      </Container>
    </ForgotPasswordPage>
  );
};

export default ForgotPassword;
