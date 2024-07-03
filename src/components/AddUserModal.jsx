import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomSingleSelect from "./CustomSingleSelect";
import api from "../services/api";

const ModalContainer = styled.div`
  background-color: #f7f6f6;
  padding: 30px;
  padding-left: 70px;
  padding-right: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Roboto", sans-serif;
`;

const FormActions = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #d9d9d9;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #c4c4c4;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  margin-bottom: 15px;
`;

const AddUserModal = ({ isVisible, onClose, title, onConfirm, fetchUrl }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !codigoUsuario) {
      setErrorMessage("Todos os campos de texto devem ser preenchidos");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Endereço de email inválido");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 letras");
      return;
    }

    if (!Number.isInteger(Number(codigoUsuario))) {
      setErrorMessage("Código de usuário deve ser um inteiro");
      return;
    }

    setErrorMessage("");

    try {
      await api.post("/usuarios", {
        nome_completo: name,
        email: email,
        senha: password,
        id_perfil: profile,
        codigo_usuario: Number(codigoUsuario),
      });
      onConfirm();
      onClose();
    } catch (error) {
      setErrorMessage("Erro ao adicionar usuário: " + error.message);
    }
  };

  const handleClose = () => {
    setErrorMessage("");
    setCodigoUsuario("");
    setName("");
    setEmail("");
    setPassword("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ModalInput
          type="text"
          placeholder="Código Usuario"
          value={codigoUsuario}
          onChange={(e) => setCodigoUsuario(e.target.value)}
          required
        />
        <ModalInput
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <ModalInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ModalInput
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <CustomSingleSelect
          fetchUrl={fetchUrl}
          placeholder="Profile"
          onChange={setProfile}
        />
        <FormActions>
          <ActionButton type="button" onClick={handleClose}>
            Voltar
          </ActionButton>
          <ActionButton type="button" onClick={handleConfirm}>
            Confirmar
          </ActionButton>
        </FormActions>
      </ModalForm>
    </ModalContainer>
  );
};

AddUserModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired,
};

export default AddUserModal;
