import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomMultiSelect from "./CustomMultiSelect";
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
  gap: 15px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Roboto", sans-serif;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const ModalButton = styled.button`
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

const AddProfileModal = ({ isVisible, onClose, title, onConfirm, fetchUrl }) => {
  const [formData, setFormData] = useState({
    nome_perfil: "",
    descricao: "",
    modules: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleModulesChange = (selectedModules) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      modules: selectedModules.map((module) => module.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/perfis", {
        nome_perfil: formData.nome_perfil,
        descricao: formData.descricao,
      });
      const profileId = response.data.id_perfil;

      const moduleAssociations = formData.modules.map((moduleId) => ({
        id_perfil: profileId,
        id_modulo: moduleId,
      }));

      await Promise.all(
        moduleAssociations.map((assoc) => api.post("/perfil-modulos", assoc))
      );

      onConfirm(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm onSubmit={handleSubmit}>
        <ModalInput
          type="text"
          name="nome_perfil"
          placeholder="Nome do Perfil"
          value={formData.nome_perfil}
          onChange={handleChange}
          required
        />
        <ModalInput
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={formData.descricao}
          onChange={handleChange}
          required
        />
        <CustomMultiSelect
          fetchUrl={fetchUrl}
          placeholder="Módulos"
          onChange={handleModulesChange}
        />
        <ModalActions>
          <ModalButton type="button" onClick={onClose}>
            Voltar
          </ModalButton>
          <ModalButton type="submit">Confirmar</ModalButton>
        </ModalActions>
      </ModalForm>
    </ModalContainer>
  );
};

AddProfileModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired,
};

export default AddProfileModal;
