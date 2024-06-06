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
import CustomMultiSelect from "../components/CustomMultiSelect";

const UserDashboard = ({ searchTerm, onSearch }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data); // Inicialmente, todos os usuários são exibidos
      })
      .catch((error) => console.error("Erro ao carregar usuários:", error));

    fetch("http://localhost:8000/perfis")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data);
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProfile) {
      filtered = filtered.filter((user) => user.perfil === selectedProfile);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedProfile]);

  const handleAddUserClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = (selectedProfiles) => {
    // Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Perfis selecionados:", selectedProfiles);
    setIsModalVisible(false);
  };

  const userButtons = [
    { text: "Adicionar usuário", onClick: handleAddUserClick },
    { text: "Remover usuário", onClick: () => console.log("Remover usuário") },
    { text: "Editar", onClick: () => console.log("Editar usuário") },
  ];

  const userColumns = [
    { header: "ID", field: "id" },
    { header: "Nome", field: "nome" },
    { header: "E-mail", field: "email" },
    { header: "Perfil", field: "perfil" },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Usuários</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <Dropdown
        options={profiles.map((profile) => profile.nome)}
        selectedOption={selectedProfile}
        onSelect={setSelectedProfile}
        placeholder="Todos os perfis"
      />
      <DynamicTable columns={userColumns} data={filteredUsers} maxRows={10} />
      <Pagination />
      <ActionButtons buttons={userButtons} />
      <Cover isVisible={isModalVisible} onClose={handleModalClose} />
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Cadastro de usuário"
        onConfirm={handleConfirm}
        fetchUrl="http://localhost:8000/perfis"
      >
        <form>
          <input type="text" placeholder="Nome completo" required />
          <input type="email" placeholder="E-mail" required />
          <CustomMultiSelect
            placeholder="Perfis"
            fetchUrl="http://localhost:8000/perfis"
            onChange={(selected) => console.log(selected)}
          />
          <input type="password" placeholder="Senha" required />
        </form>
      </Modal>
    </div>
  );
};

UserDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserDashboard;
