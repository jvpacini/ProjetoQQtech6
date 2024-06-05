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

const TransactionDashboard = ({ searchTerm, onSearch }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/transacoes")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setFilteredTransactions(data);
      })
      .catch((error) => console.error("Erro ao carregar transações:", error));
  }, []);

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [transactions, searchTerm]);

  const handleAddTransactionClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    // Adicione a lógica de confirmação aqui
    setIsModalVisible(false);
  };

  const transactionButtons = [
    { text: "Adicionar transação", onClick: handleAddTransactionClick },
    {
      text: "Remover transação",
      onClick: () => console.log("Remover transação"),
    },
    { text: "Editar", onClick: () => console.log("Editar transação") },
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
      />
      <Pagination />
      <ActionButtons buttons={transactionButtons} />
      <Cover isVisible={isModalVisible} onClose={handleModalClose} />
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Cadastro de transação"
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

TransactionDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default TransactionDashboard;
