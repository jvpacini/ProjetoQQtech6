import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Dropdown from "../components/Dropdown";
import SideBar from "../components/SideBar";
import "./Dashboard.css";

function FunctionDashboard() {
  console.log("FunctionDashboard.jsx");
  const [functions, setFunctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [filteredFunctions, setFilteredFunctions] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [functionNames, setFunctionNames] = useState([]);

  useEffect(() => {
    fetch("/api/functions")
      .then((response) => response.json())
      .then((data) => {
        setFunctions(data);
        setFunctionNames(data.map((func) => func.nome));
        setAllModules([...new Set(data.map((func) => func.modulo))]);
      })
      .catch((error) => console.error("Erro ao carregar funções:", error));
  }, []);

  useEffect(() => {
    setFilteredFunctions(
      functions.filter(
        (func) => func.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedModule === "" || func.modulo === selectedModule)
      )
    );
  }, [functions, searchTerm, selectedModule]);

  const functionButtons = [
    {
      text: "Adicionar função",
      onClick: () => console.log("Adicionar função"),
    },
    { text: "Remover função", onClick: () => console.log("Remover função") },
    { text: "Editar", onClick: () => console.log("Editar função") },
  ];

  const functionColumns = [
    { header: "ID", field: "id" },
    { header: "Nome", field: "nome" },
    { header: "Módulo", field: "modulo" },
    { header: "Descrição", field: "descricao" },
  ];

  return (
    <div className="content">
      <h1>Funções</h1>
      <SideBar />
      <SearchBar data={functionNames} onSearch={setSearchTerm} />
      <Dropdown
        options={allModules}
        selectedOption={selectedModule}
        onSelect={setSelectedModule}
        placeholder="Todos os módulos" />
      <DynamicTable
        columns={functionColumns}
        data={filteredFunctions}
        maxRows={10} />
      <Pagination />
      <ActionButtons buttons={functionButtons} />
    </div>
  );
}

export default FunctionDashboard;
