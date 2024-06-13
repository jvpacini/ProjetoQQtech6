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

const TransactionDashboard = ({ searchTerm, onSearch }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetch("http://localhost:8000/transacoes")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setFilteredTransactions(data); // Inicialmente, todas as transações são exibidas
      })
      .catch((error) => console.error("Erro ao carregar transações:", error));
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [transactions, searchTerm, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddTransactionClick = () => {
    setIsAddModalVisible(true);
  };

  const handleEditTransactionClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor, selecione uma transação para editar.");
    }
  };

  const handleDeleteTransactionClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Por favor, selecione uma transação para deletar.");
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

  const handleAddConfirm = (newTransaction) => {
    // TODO: Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Nova transação:", newTransaction);
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = (updatedTransaction) => {
    // TODO: Adicione a lógica de atualização aqui, por exemplo, enviar os dados atualizados para o servidor
    console.log("Transação atualizada:", updatedTransaction);
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    // TODO: Adicione a lógica de exclusão aqui, por exemplo, enviar a solicitação para o servidor
    console.log("Transação a ser deletada:", selectedRow);
    setIsDeleteModalVisible(false);
  };

  const transactionButtons = [
    { text: "Adicionar transação", onClick: handleAddTransactionClick },
    { text: "Remover transação", onClick: handleDeleteTransactionClick },
    { text: "Editar transação", onClick: handleEditTransactionClick },
  ];

  const transactionColumns = [
    { header: "Código", field: "codigo" },
    { header: "Nome", field: "nome" },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Transações</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <DynamicTable
        columns={transactionColumns}
        data={filteredTransactions}
        maxRows={10}
        onRowClick={(row) => setSelectedRow(row)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={transactionButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleAddModalClose}
      />
      <SimpleAddModal
        isVisible={isAddModalVisible}
        onClose={handleAddModalClose}
        title="Adicionar Transação"
        onConfirm={handleAddConfirm}
        fields={[
          { label: "Código", name: "codigo", type: "text", required: true },
          { label: "Nome", name: "nome", type: "text", required: true },
        ]}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar Transação"
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
        title="Deletar Transação"
        fields={[
          { label: "Código", value: selectedRow ? selectedRow.codigo : "" },
          { label: "Nome", value: selectedRow ? selectedRow.nome : "" },
        ]}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

TransactionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default TransactionDashboard;
