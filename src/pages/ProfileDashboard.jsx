import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import Modal from "../components/Modal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Dropdown from "../components/Dropdown";

const ProfileDashboard = ({ searchTerm, onSearch }) => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    // Adicione a lógica de confirmação aqui
    setIsModalVisible(false);
  };

  const profileButtons = [
    { text: "Adicionar perfil", onClick: handleAddProfileClick },
    { text: "Remover perfil", onClick: () => console.log("Remover perfil") },
    { text: "Editar", onClick: () => console.log("Editar perfil") },
  ];

  const profileColumns = [
    { header: "Nome do perfil", field: "nome" },
    { header: "Módulos associados", field: "modulos" },
  ];

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
      />
      <Pagination />
      <ActionButtons buttons={profileButtons} />
      <Cover isVisible={isModalVisible} onClose={handleModalClose} />
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Cadastro de perfil"
        onConfirm={handleConfirm}
      >
        <form>
          <input type="text" placeholder="Nome do perfil" required />
          <input type="text" placeholder="Módulos associados" required />
        </form>
      </Modal>
    </div>
  );
};

ProfileDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ProfileDashboard;
