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
import api from "../services/api";
import Cookies from "js-cookie";
import "./Dashboard.css";

const FunctionDashboard = ({ searchTerm, onSearch }) => {
  const [functions, setFunctions] = useState([]);
  const [filteredFunctions, setFilteredFunctions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
        const response = await api.get("/funcoes");
        setFunctions(response.data);
        setFilteredFunctions(response.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = functions;

    if (searchTerm) {
      filtered = filtered.filter((funcao) =>
        funcao.nome_funcao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFunctions(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [functions, searchTerm, currentPage]);

  const handleAddFunctionClick = () => {
    setIsAddModalVisible(true);
  };

  const handleRemoveFunctionClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Please select a function to remove.");
    }
  };

  const handleEditFunctionClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Please select a function to edit.");
    }
  };

  const handleModalClose = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedRow(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedRow(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddConfirm = async (newFunction) => {
    try {
      const response = await api.post("/funcoes", newFunction);
      setFunctions([...functions, response.data]);
    } catch (error) {
      console.error("Error adding function:", error);
    }
    setIsAddModalVisible(false);
    refreshData();
  };

  const handleEditConfirm = async (updatedFunction) => {
    try {
      await api.put(`/funcoes/${selectedRow.id_funcao}`, updatedFunction);
      setFunctions(
        functions.map((funcao) =>
          funcao.id_funcao === selectedRow.id_funcao ? updatedFunction : funcao
        )
      );
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating function:", error);
    }
    setIsEditModalVisible(false);
    refreshData();
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      try {
        await api.delete(`/funcoes/${selectedRow.id_funcao}`);
        setFunctions(
          functions.filter((funcao) => funcao.id_funcao !== selectedRow.id_funcao)
        );
        setSelectedRow(null);
      } catch (error) {
        console.error("Error deleting function:", error);
      }
    }
    setIsDeleteModalVisible(false);
    refreshData();
  };

  const refreshData = async () => {
    try {
      const response = await api.get("/funcoes");
      setFunctions(response.data);
      setFilteredFunctions(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const functionButtons = [
    { text: "Adicionar função", onClick: handleAddFunctionClick },
    { text: "Remover função", onClick: handleRemoveFunctionClick },
    { text: "Editar função", onClick: handleEditFunctionClick },
  ];

  const functionColumns = [
    { header: "Código", field: "codigo_funcao" },
    { header: "Nome", field: "nome_funcao" },
    { header: "Descrição", field: "descricao" },
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={functionButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleModalClose}
      />
      <SimpleAddModal
        isVisible={isAddModalVisible}
        onClose={handleModalClose}
        title="Adicionar Função"
        onConfirm={handleAddConfirm}
        fields={[
          { label: "Código", name: "codigo_funcao", type: "text" },
          { label: "Nome", name: "nome_funcao", type: "text" },
          { label: "Descrição", name: "descricao", type: "text" },
        ]}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Editar Função"
        onConfirm={handleEditConfirm}
        fields={[
          { label: "Código", name: "codigo_funcao", type: "text" },
          { label: "Nome", name: "nome_funcao", type: "text" },
          { label: "Descrição", name: "descricao", type: "text" },
        ]}
        rowData={selectedRow}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Deletar função"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Código", value: selectedRow.codigo_funcao },
                { label: "Nome", value: selectedRow.nome_funcao },
                { label: "Descrição", value: selectedRow.descricao },
              ]
            : []
        }
      />
    </div>
  );
};

FunctionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default FunctionDashboard;
