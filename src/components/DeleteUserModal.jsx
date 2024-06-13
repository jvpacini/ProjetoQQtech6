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

const ModalField = styled.div`
  margin-bottom: 15px;
`;

const FieldLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const FieldValue = styled.span`
  display: block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const FormActions = styled.div`
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

const DeleteUserModal = ({ isVisible, onClose, title, fields, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm>
        {fields.map((field, index) => (
          <ModalField key={index}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldValue>{field.value}</FieldValue>
          </ModalField>
        ))}
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

DeleteUserModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteUserModal;
