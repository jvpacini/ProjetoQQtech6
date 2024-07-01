import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import api from "../services/api"; // Make sure the path is correct

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

const ModalSelect = styled.select`
  width: 100%;
  padding: 10px;
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

const EditUserModal = ({ isVisible, onClose, title, onConfirm, userData }) => {
  const [formData, setFormData] = useState(userData);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get("/perfis");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error loading profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const selectedProfileId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      id_perfil: selectedProfileId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm onSubmit={handleSubmit}>
        <ModalInput
          type="text"
          name="nome_completo"
          placeholder="Nome completo"
          value={formData.nome_completo}
          onChange={handleChange}
          required
        />
        <ModalInput
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <ModalInput
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <ModalSelect
          name="id_perfil"
          value={formData.id_perfil || ""}
          onChange={handleProfileChange}
        >
          <option value="">Selecione um perfil</option>
          {profiles.map((profile) => (
            <option key={profile.id_perfil} value={profile.id_perfil}>
              {profile.nome_perfil}
            </option>
          ))}
        </ModalSelect>
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

EditUserModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    nome_completo: PropTypes.string,
    email: PropTypes.string,
    senha: PropTypes.string,
    id_perfil: PropTypes.number,
  }).isRequired,
};

export default EditUserModal;
