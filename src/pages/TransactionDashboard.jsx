import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Dropdown from "../components/Dropdown";
import SideBar from "../components/SideBar";
import "./Dashboard.css";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [transactionNames, setTransactionNames] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setTransactionNames(data.map((transaction) => transaction.nome));
        setAllModules([
          ...new Set(data.map((transaction) => transaction.moduloAssociado)),
        ]);
      })
      .catch((error) => console.error("Erro ao carregar transações:", error));
  }, []);

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(
        (transaction) =>
          transaction.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedModule === "" ||
            transaction.moduloAssociado === selectedModule)
      )
    );
  }, [transactions, searchTerm, selectedModule]);

  const transactionButtons = [
    {
      text: "Adicionar transação",
      onClick: () => console.log("Adicionar transação"),
    },
    {
      text: "Remover transação",
      onClick: () => console.log("Remover transação"),
    },
    { text: "Editar", onClick: () => console.log("Editar transação") },
  ];

  const transactionColumns = [
    { header: "ID", field: "id" },
    { header: "Nome", field: "nome" },
    { header: "Descrição", field: "descricao" },
    { header: "Módulo associado", field: "moduloAssociado" },
  ];

  return (
    <div className="content">
      <h1>Transações</h1>
      <SideBar />
      <SearchBar data={transactionNames} onSearch={setSearchTerm} />
      <Dropdown
        options={allModules}
        selectedOption={selectedModule}
        onSelect={setSelectedModule}
        placeholder="Todos os módulos"
      />
      <DynamicTable
        columns={transactionColumns}
        data={filteredTransactions}
        maxRows={10}
      />
      <Pagination />
      <ActionButtons buttons={transactionButtons} />
    </div>
  );
};

export default TransactionDashboard;
