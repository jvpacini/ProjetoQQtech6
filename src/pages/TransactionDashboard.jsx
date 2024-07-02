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
      setTransactions(transactionsResponse.data);
      setFilteredTransactions(transactionsResponse.data);
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
      alert("Please select a transaction to edit.");
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
      fetchData();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = async (updatedTransaction) => {
    try {
      await api.put(
        `/transacoes/${selectedRow.id_transacao}`,
        updatedTransaction
      );
      setTransactions(
        transactions.map((transaction) =>
          transaction.id_transacao === updatedTransaction.id_transacao
            ? updatedTransaction
            : transaction
        )
      );
      fetchData();
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
        fetchData();
        setSelectedRow(null);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const transactionButtons = [
    { text: "Add Transaction", onClick: handleAddTransactionClick },
    { text: "Remove Transaction", onClick: handleRemoveTransactionClick },
    { text: "Edit Transaction", onClick: handleEditTransactionClick },
  ];

  const transactionColumns = [
    { header: "Código", field: "codigo_transacao" },
    { header: "Nome", field: "nome_transacao" },
    { header: "Descrição", field: "descricao" },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Transactions</h1>
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
        title="Add Transaction"
        onConfirm={handleAddConfirm}
        fields={[
          { label: "Code", name: "codigo_transacao", type: "text" },
          { label: "Name", name: "nome_transacao", type: "text" },
          { label: "Description", name: "descricao", type: "text" },
        ]}
      />
      <SimpleEditModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Edit Transaction"
        onConfirm={handleEditConfirm}
        fields={[
          { label: "Code", name: "codigo_transacao", type: "text" },
          { label: "Name", name: "nome_transacao", type: "text" },
          { label: "Description", name: "descricao", type: "text" },
        ]}
        transactionData={selectedRow}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Delete Transaction"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                {
                  label: "Transaction Code",
                  value: selectedRow.codigo_transacao,
                },
                {
                  label: "Transaction Name",
                  value: selectedRow.nome_transacao,
                },
                { label: "Description", value: selectedRow.descricao },
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
