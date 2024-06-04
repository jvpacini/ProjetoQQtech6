import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Dropdown from "../components/Dropdown";
import SideBar from "../components/SideBar";
import "./Dashboard.css";

const ProfileDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [allProfileNames, setAllProfileNames] = useState([]);
  const [profileNames, setProfileNames] = useState([]);

  useEffect(() => {
    fetch("/api/profiles")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data);
        setProfileNames(data.map((profile) => profile.nome));
        setAllProfileNames([
          ...new Set(data.map((profile) => profile.perfilAssociado)),
        ]);
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));
  }, []);

  useEffect(() => {
    setFilteredProfiles(
      profiles.filter(
        (profile) =>
          profile.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedProfile === "" ||
            profile.perfilAssociado === selectedProfile)
      )
    );
  }, [profiles, searchTerm, selectedProfile]);

  const profileButtons = [
    {
      text: "Adicionar relação",
      onClick: () => console.log("Adicionar relação"),
    },
    {
      text: "Desfazer relação",
      onClick: () => console.log("Desfazer relação"),
    },
    { text: "Editar", onClick: () => console.log("Editar") },
    { text: "Ver perfis", onClick: () => console.log("Ver perfis") },
    {
      text: "Criação de perfil",
      onClick: () => console.log("Criação de perfil"),
    },
    { text: "Excluir perfil", onClick: () => console.log("Excluir perfil") },
  ];

  const profileColumns = [
    { header: "Nome do usuário", field: "nome" },
    { header: "Perfil associado", field: "perfilAssociado" },
  ];

  return (
    <div className="content">
      <h1>Perfis</h1>
      <SideBar />
      <SearchBar data={profileNames} onSearch={setSearchTerm} />
      <Dropdown
        options={allProfileNames}
        selectedOption={selectedProfile}
        onSelect={setSelectedProfile}
        placeholder="Todos os perfis"
      />
      <DynamicTable
        columns={profileColumns}
        data={filteredProfiles}
        maxRows={10}
      />
      <Pagination />
      <ActionButtons buttons={profileButtons} />
    </div>
  );
};

export default ProfileDashboard;
