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

const ModuleDashboard = ({ searchTerm, onSearch }) => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/modulos")
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
        setFilteredModules(data);
      })
      .catch((error) => console.error("Erro ao carregar módulos:", error));
  }, []);

  useEffect(() => {
    setFilteredModules(
      modules.filter((module) =>
        module.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [modules, searchTerm]);

  const handleAddModuleClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    // Adicione a lógica de confirmação aqui
    setIsModalVisible(false);
  };

  const moduleButtons = [
    { text: "Adicionar módulo", onClick: handleAddModuleClick },
    { text: "Remover módulo", onClick: () => console.log("Remover módulo") },
    { text: "Editar", onClick: () => console.log("Editar módulo") },
  ];

  const moduleColumns = [
    { header: "Código", field: "codigo" },
    { header: "Nome", field: "nome" },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Módulos</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <DynamicTable
        columns={moduleColumns}
        data={filteredModules}
        maxRows={10}
      />
      <Pagination />
      <ActionButtons buttons={moduleButtons} />
      <Cover isVisible={isModalVisible} onClose={handleModalClose} />
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Cadastro de módulo"
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

ModuleDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ModuleDashboard;
