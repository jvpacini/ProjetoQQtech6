import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Dropdown from "../components/Dropdown";
import EditProfileModal from "../components/EditProfileModal";
import AddProfileModal from "../components/AddProfileModal";

const ProfileDashboard = ({ searchTerm, onSearch }) => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/perfis")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data);
        setFilteredProfiles(data); // Inicialmente, todos os perfis são exibidos
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));

    fetch("http://localhost:8000/modulos")
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
      })
      .catch((error) => console.error("Erro ao carregar módulos:", error));
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter((profile) =>
        profile.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedModule) {
      filtered = filtered.filter((profile) =>
        profile.modulos.includes(selectedModule)
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, selectedModule]);

  const handleAddProfileClick = () => {
    setIsAddModalVisible(true);
  };

  const handleEditProfileClick = () => {
    if (selectedProfile) {
      setIsEditModalVisible(true);
    } else {
      console.error("Nenhum perfil selecionado");
    }
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const handleConfirmAdd = (newProfile) => {
    // Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Novo perfil:", newProfile);
    setIsAddModalVisible(false);
  };

  const handleConfirmEdit = (updatedProfile) => {
    // Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Perfil atualizado:", updatedProfile);
    setIsEditModalVisible(false);
  };

  const profileButtons = [
    { text: "Adicionar perfil", onClick: handleAddProfileClick },
    { text: "Remover perfil", onClick: () => console.log("Remover perfil") },
    { text: "Editar", onClick: handleEditProfileClick },
  ];

  const profileColumns = [
    { header: "Nome", field: "nome" },
    { header: "Módulos", field: "modulos" },
  ];

  const handleRowClick = (rowData) => {
    setSelectedProfile(rowData);
  };

  return (
    <div className="content">
      <SideBar />
      <h1>Perfis</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <Dropdown
        options={modules.map((module) => module.codigo)}
        selectedOption={selectedModule}
        onSelect={setSelectedModule}
        placeholder="Todos os módulos"
      />
      <DynamicTable
        columns={profileColumns}
        data={filteredProfiles}
        maxRows={10}
        onRowClick={handleRowClick}
      />
      <Pagination />
      <ActionButtons buttons={profileButtons} />
      <Cover
        isVisible={isEditModalVisible || isAddModalVisible}
        onClose={handleModalClose}
      />
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Editar perfil"
        profile={selectedProfile}
        onConfirm={handleConfirmEdit}
        fetchUrl="http://localhost:8000/modulos"
      />
      <AddProfileModal
        isVisible={isAddModalVisible}
        onClose={handleModalClose}
        title="Adicionar perfil"
        onConfirm={handleConfirmAdd}
        fetchUrl="http://localhost:8000/modulos"
      />
    </div>
  );
};

ProfileDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ProfileDashboard;
