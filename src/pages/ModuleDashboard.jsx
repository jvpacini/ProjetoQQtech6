import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import "./Dashboard.css";
import SideBar from "../components/SideBar";

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModules, setFilteredModules] = useState([]);
  const [moduleNames, setModuleNames] = useState([]);

  useEffect(() => {
    fetch("/api/modules")
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
        setModuleNames(data.map((mod) => mod.nome));
      })
      .catch((error) => console.error("Erro ao carregar módulos:", error));
  }, []);

  useEffect(() => {
    setFilteredModules(
      modules.filter((mod) =>
        mod.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [modules, searchTerm]);

  const moduleButtons = [
    {
      text: "Adicionar módulo",
      onClick: () => console.log("Adicionar módulo"),
    },
    { text: "Remover módulo", onClick: () => console.log("Remover módulo") },
    { text: "Editar", onClick: () => console.log("Editar módulo") },
  ];

  const moduleColumns = [
    { header: "ID", field: "id" },
    { header: "Nome", field: "nome" },
    { header: "Descrição", field: "descricao" },
  ];

  return (
    <div className="content">
      <h1>Módulos</h1>
      <SideBar />
      <SearchBar data={moduleNames} onSearch={setSearchTerm} />
      <DynamicTable
        columns={moduleColumns}
        data={filteredModules}
        maxRows={10}
      />
      <Pagination />
      <ActionButtons buttons={moduleButtons} />
    </div>
  );
};

export default ModuleDashboard;
