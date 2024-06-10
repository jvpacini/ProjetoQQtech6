import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import AddModuleModal from "../components/SimpleAddModal";
import SimpleEditModal from "../components/SimpleEditModal";
import DeleteModal from "../components/DeleteModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";

const ModuleDashboard = ({ searchTerm, onSearch }) => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/modulos")
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
        setFilteredModules(data); // Inicialmente, todos os módulos são exibidos
      })
      .catch((error) => console.error("Erro ao carregar módulos:", error));
  }, []);

  useEffect(() => {
    let filtered = modules;

    if (searchTerm) {
      filtered = filtered.filter((module) =>
        module.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModules(filtered);
  }, [modules, searchTerm]);

  const handleAddModuleClick = () => {
    setIsAddModalVisible(true);
  };

  const handleEditModuleClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor, selecione um módulo para editar.");
    }
  };

  const handleDeleteModuleClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Por favor, selecione um módulo para deletar.");
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedRow(null); // Deseleciona a linha ao fechar o modal
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedRow(null); // Deseleciona a linha ao fechar o modal
  };

  const handleAddConfirm = (newModule) => {
    // Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Novo módulo:", newModule);
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = (updatedModule) => {
    // Adicione a lógica de atualização aqui, por exemplo, enviar os dados atualizados para o servidor
    console.log("Módulo atualizado:", updatedModule);
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    // Adicione a lógica de exclusão aqui, por exemplo, enviar a solicitação para o servidor
    console.log("Módulo a ser deletado:", selectedRow);
    setIsDeleteModalVisible(false);
  };

  const moduleButtons = [
    { text: "Adicionar módulo", onClick: handleAddModuleClick },
    { text: "Remover módulo", onClick: handleDeleteModuleClick },
    { text: "Editar módulo", onClick: handleEditModuleClick },
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
        onRowClick={(row) => setSelectedRow(row)}
      />
      <Pagination />
      <ActionButtons buttons={moduleButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleAddModalClose}
      />
      <AddModuleModal
        isVisible={isAddModalVisible}
        onClose={handleAddModalClose}
        title="Adicionar Módulo"
        onConfirm={handleAddConfirm}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar Módulo"
        module={selectedRow}
        onConfirm={handleEditConfirm}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Deletar Módulo"
        fields={[
          { label: "Nome", value: selectedRow ? selectedRow.nome : "" },
          { label: "Código", value: selectedRow ? selectedRow.codigo : "" },
        ]}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

ModuleDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ModuleDashboard;
