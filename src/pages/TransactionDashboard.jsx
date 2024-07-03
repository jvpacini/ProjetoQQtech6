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

const TransactionDashboard = ({ searchTerm, onSearch }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
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
      const transactionsResponse = await api.get("/transacoes");
      const sortedTransactions = transactionsResponse.data.sort(
        (a, b) => a.id_transacao - b.id_transacao
      );
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.nome_transacao
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [transactions, searchTerm, currentPage]);

  const handleAddTransactionClick = () => {
    setIsAddModalVisible(true);
  };

  const handleRemoveTransactionClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Please select a transaction to remove.");
    }
  };

  const handleEditTransactionClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor selecione uma transação para edição");
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

  const handleAddConfirm = async (newTransaction) => {
    try {
      const response = await api.post("/transacoes", newTransaction);
      setTransactions([...transactions, response.data]);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = async (updatedTransaction) => {
    try {
      await api.put(`/transacoes/${selectedRow.id_transacao}`, updatedTransaction);
      setTransactions(
        transactions.map((transaction) => 
          transaction.id_funcao === selectedRow.id_transacao ? updatedTransaction : transaction
        )
      );
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      try {
        await api.delete(`/transacoes/${selectedRow.id_transacao}`);
        setTransactions(
          transactions.filter(
            (transaction) =>
              transaction.id_transacao !== selectedRow.id_transacao
          )
        );
        setSelectedRow(null);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const transactionButtons = [
    { text: "Adicionar Transação", onClick: handleAddTransactionClick },
    { text: "Remover Transação", onClick: handleRemoveTransactionClick },
    { text: "Editar Transação", onClick: handleEditTransactionClick },
  ];

  const transactionColumns = [
    { header: "Código", field: "codigo_transacao" },
    { header: "Nome", field: "nome_transacao" },
    { header: "Descrição", field: "descricao" },
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
        onClose={handleModalClose}
      />
      <SimpleAddModal
        isVisible={isAddModalVisible}
        onClose={handleModalClose}
        title="Adicionar Transação"
        onConfirm={handleAddConfirm}
        fields={[
          { label: "Código", name: "codigo_transacao", type: "text" },
          { label: "Nome", name: "nome_transacao", type: "text" },
          { label: "Descrição", name: "descricao", type: "text" },
        ]}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Editar Transação"
        onConfirm={handleEditConfirm}
        fields={[
          { label: "Código", name: "codigo_transacao", type: "text" },
          { label: "Nome", name: "nome_transacao", type: "text" },
          { label: "Descrição", name: "descricao", type: "text" },
        ]}
        transactionData={selectedRow}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Deletar Transação"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                {
                  label: "Código transação",
                  value: selectedRow.codigo_transacao,
                },
                {
                  label: "Nome transação",
                  value: selectedRow.nome_transacao,
                },
                { label: "Descrição", value: selectedRow.descricao },
              ]
            : []
        }
      />
    </div>
  );
};

TransactionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default TransactionDashboard;
