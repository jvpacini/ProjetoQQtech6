import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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

const ErrorMessage = styled.p`
  color: red;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  margin-bottom: 15px;
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

const SimpleAddModal = ({
  isVisible,
  onClose,
  title,
  onConfirm,
  fields,
}) => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(''); 
  };

  const handleConfirm = () => {
    let hasEmptyFields = fields.some(field => {
      return (!formData[field.name] || formData[field.name].trim() === '') && field.name !== 'descricao';
    });

    if (hasEmptyFields) {
      setErrorMessage('Por favor preencha os campos código e nome');
    } else {
      onConfirm(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <ModalForm>
        {fields.map((field, index) => (
          <ModalInput
            key={index}
            type="text"
            name={field.name}
            placeholder={field.label}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            required
          />
        ))}
        <FormActions>
          <ActionButton type="button" onClick={handleClose}>
            Cancel
          </ActionButton>
          <ActionButton type="button" onClick={handleConfirm}>
            Confirm
          </ActionButton>
        </FormActions>
      </ModalForm>
    </ModalContainer>
  );
};

SimpleAddModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SimpleAddModal;
