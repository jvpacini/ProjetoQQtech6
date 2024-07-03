import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import AddModuleModal from "../components/AddModuleModal";
import EditModuleModal from "../components/EditModuleModal";
import DeleteModal from "../components/DeleteModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import Cookies from "js-cookie";

const ModuleDashboard = ({ searchTerm, onSearch }) => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 7;

  const fetchData = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await api.get("/modulos-details");
      const modulesData = response.data;

      // Preprocess the data
      const processedData = modulesData.map((module) => ({
        ...module,
        funcaoCodes: module.funcoes.length ? module.funcoes.map(f => f.codigo_funcao).join(", ") : "N/A",
        transacaoCodes: module.transacoes.length ? module.transacoes.map(t => t.codigo_transacao).join(", ") : "N/A"
      }));

      setModules(processedData);
      setFilteredModules(processedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = modules;

    if (searchTerm) {
      filtered = filtered.filter((module) =>
        module.nome_modulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModules(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [modules, searchTerm, currentPage]);

  const handleAddModuleClick = () => {
    setIsAddModalVisible(true);
  };

  const handleRemoveModuleClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Please select a module to remove.");
    }
  };

  const handleEditModuleClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Please select a module to edit.");
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

  const handleAddConfirm = async (newModule) => {
    try {
      await api.post("/modulos", newModule);
      fetchData();
    } catch (error) {
      console.error("Error adding module:", error);
    }
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = async (updatedModule) => {
    try {
      await api.put(`/modulos/${updatedModule.id_modulo}`, updatedModule);
      fetchData();
    } catch (error) {
      console.error("Error updating module:", error);
    }
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      try {
        await api.delete(`${selectedRow.id_modulo}/associations`);
        fetchData();
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const moduleButtons = [
    { text: "Adicionar Módulo", onClick: handleAddModuleClick },
    { text: "Remover Módulo", onClick: handleRemoveModuleClick },
    { text: "Editar Módulo", onClick: handleEditModuleClick },
  ];

  const moduleColumns = [
    { header: "Código", field: "codigo_modulo" },
    { header: "Nome do módulo", field: "nome_modulo" },
    { header: "Funções", field: "funcaoCodes" },
    { header: "Transações", field: "transacaoCodes" },
    { header: "Descrição", field: "descricao" },
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={moduleButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleModalClose}
      />
      <AddModuleModal
        isVisible={isAddModalVisible}
        onClose={handleModalClose}
        title="Adicionar módulo"
        onConfirm={handleAddConfirm}
        fetchFunctionsUrl="http://localhost:5050/api/funcoes"
        fetchTransactionsUrl="http://localhost:5050/api/transacoes"
      />
      <EditModuleModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Editar módulo"
        onConfirm={handleEditConfirm}
        moduleData={selectedRow}
        fetchFuncUrl="http://localhost:5050/api/funcoes"
        fetchTransUrl="http://localhost:5050/api/transacoes"
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Remover Módulo"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Nome", value: selectedRow.nome_modulo },
                { label: "Descrição", value: selectedRow.descricao },
              ]
            : []
        }
      />
    </div>
  );
};

ModuleDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ModuleDashboard;
