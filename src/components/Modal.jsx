import { useState } from "react";
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
  gap: 15px;
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
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  margin-top: 10rem;
  border: none;
  border-radius: 5px;
  background-color: #d9d9d9;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #c4c4c4;
  }
`;

const Modal = ({ isVisible, onClose, title, onConfirm, fetchUrl }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const handleConfirm = () => {
    onConfirm(selectedProfiles);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm>
        <ModalInput type="text" placeholder="Nome completo" required />
        <ModalInput type="email" placeholder="E-mail" required />
        <ModalInput type="password" placeholder="Senha" required />
        <CustomSingleSelect
          fetchUrl={fetchUrl}
          placeholder="Perfil"
          onChange={setSelectedProfiles}
        />
        <FormActions>
          <ActionButton type="button" onClick={onClose}>
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

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired,
};

export default Modal;
