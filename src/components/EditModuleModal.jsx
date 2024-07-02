import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomMultiSelectModule from "./CustomMultiSelectModule";

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

const EditModuleModal = ({
  isVisible,
  onClose,
  title,
  moduleData,
  onConfirm,
}) => {
  const [codigoModulo, setCodigoModulo] = useState("");
  const [nomeModulo, setNomeModulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (moduleData) {
      setCodigoModulo(moduleData.codigo_modulo);
      setNomeModulo(moduleData.nome_modulo);
      setDescricao(moduleData.descricao);
      setSelectedFunctions(
        moduleData.functions?.map((func) => ({
          value: func.id_funcao,
          label: func.codigo_funcao,
        }))
      );
      setSelectedTransactions(
        moduleData.transactions?.map((trans) => ({
          value: trans.id_transacao,
          label: trans.codigo_transacao,
        }))
      );
    }
  }, [moduleData]);

  const handleConfirm = () => {
    if (!codigoModulo || !nomeModulo) {
      setErrorMessage("Todos os campos de texto devem ser preenchidos");
      return;
    }

    const updatedModule = {
      ...moduleData,
      codigo_modulo: codigoModulo,
      nome_modulo: nomeModulo,
      descricao,
      funcaoIds: selectedFunctions,
      transacaoIds: selectedTransactions,
    };
    onConfirm(updatedModule);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalContainer>
      <ModalTitle>{title}</ModalTitle>
      <ModalForm>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ModalInput
          id="codigo modulo"
          type="text"
          value={codigoModulo}
          placeholder="Código do Módulo"
          onChange={(e) => setCodigoModulo(e.target.value)}
          required
        />
        <ModalInput
          id="nome modulo"
          type="text"
          value={nomeModulo}
          placeholder="Nome do Módulo"
          onChange={(e) => setNomeModulo(e.target.value)}
          required
        />
        <ModalInput
          id="descricao modulo"
          type="text"
          value={descricao}
          placeholder="Descrição"
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <CustomMultiSelectModule
            labelKey="codigo_funcao"
            valueKey="id_funcao"
            fetchUrl="http://localhost:5050/api/funcoes"
            placeholder="Funções"
            onChange={setSelectedFunctions}
            defaultValue={selectedFunctions}
          />
          <CustomMultiSelectModule
            labelKey="codigo_transacao"
            valueKey="id_transacao"
            fetchUrl="http://localhost:5050/api/transacoes"
            placeholder="Transações"
            onChange={setSelectedTransactions}
            defaultValue={selectedTransactions}
          />
        </div>
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

EditModuleModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  moduleData: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
};

export default EditModuleModal;
