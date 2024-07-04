import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomSingleSelect from "./CustomSingleSelect";

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

const EditUserModal = ({ isVisible, onClose, title, onConfirm, userData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.nome_completo || "");
      setEmail(userData.email || "");
      setCodigoUsuario(userData.codigo_usuario || "");
    }
  }, [userData]);

  const handleConfirm = async () => {
    if (!email || !name || !codigoUsuario) {
      setErrorMessage("Todos os campos de texto devem ser preenchidos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Endereço de email inválido");
      return;
    }

    if (!Number.isInteger(Number(codigoUsuario))) {
      setErrorMessage("Código de usuário deve ser um inteiro");
      return;
    }

    setErrorMessage("");

    const updatedUser = {
      ...userData,
      codigo_usuario: codigoUsuario,
      nome_completo: name,
      email,
      id_perfil: profile,
    };

    onConfirm(updatedUser);
    onClose();
  };

  const handleClose = () => {
    setErrorMessage("");
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
        <CustomSingleSelect
          fetchUrl="http://localhost:5050/api/perfis"
          placeholder="Perfil"
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

EditUserModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
    nome_completo: PropTypes.string,
    email: PropTypes.string,
    id_perfil: PropTypes.number,
    codigo_usuario: PropTypes.number,
  }),
};

export default EditUserModal;
