import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import SimpleAddModal from "../components/SimpleAddModal";
import SimpleEditModal from "../components/SimpleEditModal";
import DeleteModal from "../components/DeleteModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import "./Dashboard.css";

const FunctionDashboard = ({ searchTerm, onSearch }) => {
  const [functions, setFunctions] = useState([]);
  const [filteredFunctions, setFilteredFunctions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/funcoes")
      .then((response) => response.json())
      .then((data) => {
        setFunctions(data);
        setFilteredFunctions(data); // Inicialmente, todas as funções são exibidas
      })
      .catch((error) => console.error("Erro ao carregar funções:", error));
  }, []);

  useEffect(() => {
    let filtered = functions;

    if (searchTerm) {
      filtered = filtered.filter((func) =>
        func.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFunctions(filtered);
  }, [functions, searchTerm]);

  const handleAddFunctionClick = () => {
    setIsAddModalVisible(true);
  };

  const handleEditFunctionClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor, selecione uma função para editar.");
    }
  };

  const handleDeleteFunctionClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Por favor, selecione uma função para deletar.");
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

  const handleAddConfirm = (newFunction) => {
    // Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Nova função:", newFunction);
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = (updatedFunction) => {
    // Adicione a lógica de atualização aqui, por exemplo, enviar os dados atualizados para o servidor
    console.log("Função atualizada:", updatedFunction);
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    // Adicione a lógica de exclusão aqui, por exemplo, enviar a solicitação para o servidor
    console.log("Função a ser deletada:", selectedRow);
    setIsDeleteModalVisible(false);
  };

  const functionButtons = [
    { text: "Adicionar função", onClick: handleAddFunctionClick },
    { text: "Remover função", onClick: handleDeleteFunctionClick },
    { text: "Editar função", onClick: handleEditFunctionClick },
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
        onRowClick={(row) => setSelectedRow(row)}
      />
      <Pagination />
      <ActionButtons buttons={functionButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleAddModalClose}
      />
      <SimpleAddModal
        isVisible={isAddModalVisible}
        onClose={handleAddModalClose}
        title="Adicionar Função"
        onConfirm={handleAddConfirm}
        fields={[
          { label: "Código", name: "codigo", type: "text", required: true },
          { label: "Nome", name: "nome", type: "text", required: true },
        ]}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar Função"
        item={selectedRow}
        onConfirm={handleEditConfirm}
        fields={[
          { label: "Código", name: "codigo", type: "text", required: true },
          { label: "Nome", name: "nome", type: "text", required: true },
        ]}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Deletar Função"
        fields={[
          { label: "Código", value: selectedRow ? selectedRow.codigo : "" },
          { label: "Nome", value: selectedRow ? selectedRow.nome : "" },
        ]}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

FunctionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default FunctionDashboard;
