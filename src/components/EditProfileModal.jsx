import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomMultiSelect from "./CustomMultiSelect";

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

const EditProfileModal = ({
  isVisible,
  onClose,
  title,
  profileData,
  onConfirm,
  fetchUrl,
}) => {
  const [idPerfil, setIdPerfil] = useState("");
  const [nomePerfil, setNomePerfil] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (profileData) {
      setIdPerfil(profileData.id_perfil);
      setNomePerfil(profileData.nome_perfil);
      setDescricao(profileData.descricao !== 'N/A' ? profileData.descricao : "");
    }
  }, [profileData]);

  const handleConfirm = () => {
    if (!nomePerfil) {
      setErrorMessage("Todos os campos de texto devem ser preenchidos");
      return;
    }

    const updatedProfile = {
      id_perfil: idPerfil,
      nome_perfil: nomePerfil,
      descricao,
      moduloIds: selectedModules,
    };
    onConfirm(updatedProfile);
    setSelectedModules([]);
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
          value={nomePerfil}
          placeholder="Nome do Perfil"
          onChange={(e) => setNomePerfil(e.target.value)}
          required
        />
        <ModalInput
          type="text"
          value={descricao}
          placeholder="Descrição"
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <CustomMultiSelect
          fetchUrl={fetchUrl}
          placeholder="Módulos"
          onChange={setSelectedModules}
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

EditProfileModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  profileData: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired,
};

export default EditProfileModal;
