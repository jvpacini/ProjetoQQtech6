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

const ProfileDashboard = ({ searchTerm, onSearch }) => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/perfis")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data);
        setFilteredProfiles(data);
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));
  }, []);

  useEffect(() => {
    setFilteredProfiles(
      profiles.filter((profile) =>
        profile.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [profiles, searchTerm]);

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
        <DynamicTable columns={profileColumns} data={filteredProfiles} maxRows={10} />
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
            <select required>
              <option value="" disabled selected>
                Módulos
              </option>
              <option value="CA">Cadastro</option>
              <option value="DG">Digitalização</option>
              {/* Adicione outras opções conforme necessário */}
            </select>
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
