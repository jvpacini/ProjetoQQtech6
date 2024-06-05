import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Modal from "../components/Modal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import "./Dashboard.css";

const FunctionDashboard = ({ searchTerm, onSearch }) => {
  const [functions, setFunctions] = useState([]);
  const [filteredFunctions, setFilteredFunctions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/funcoes")
      .then((response) => response.json())
      .then((data) => {
        setFunctions(data);
        setFilteredFunctions(data);
      })
      .catch((error) => console.error("Erro ao carregar funções:", error));
  }, []);

  useEffect(() => {
    setFilteredFunctions(
      functions.filter((func) =>
        func.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [functions, searchTerm]);

  const handleAddFunctionClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    // Adicione a lógica de confirmação aqui
    setIsModalVisible(false);
  };

  const functionButtons = [
    { text: "Adicionar função", onClick: handleAddFunctionClick },
    { text: "Remover função", onClick: () => console.log("Remover função") },
    { text: "Editar", onClick: () => console.log("Editar função") },
  ];

  const functionColumns = [
    { header: "Código", field: "codigo" },
    { header: "Nome", field: "nome" },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Funções</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <DynamicTable
        columns={functionColumns}
        data={filteredFunctions}
        maxRows={10}
      />
      <Pagination />
      <ActionButtons buttons={functionButtons} />
      <Cover isVisible={isModalVisible} onClose={handleModalClose} />
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Cadastro de função"
        onConfirm={handleConfirm}
      >
        <form>
          <input type="text" placeholder="Código" required />
          <input type="text" placeholder="Nome" required />
        </form>
      </Modal>
    </div>
  );
};

FunctionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default FunctionDashboard;
