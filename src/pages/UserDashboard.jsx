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

const UserDashboard = ({ searchTerm, onSearch }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error("Erro ao carregar usuários:", error));
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const handleAddUserClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    // Adicione a lógica de confirmação aqui
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
    <div className="dashboard-container">
      <h1>Usuários</h1>
      <SideBar />
      <div className="content">
        <SearchBar data={[]} onSearch={onSearch} />
        <DynamicTable columns={userColumns} data={filteredUsers} maxRows={10} />
        <Pagination />
        <ActionButtons buttons={userButtons} />
        <Cover isVisible={isModalVisible} onClose={handleModalClose} />
        <Modal
          isVisible={isModalVisible}
          onClose={handleModalClose}
          title="Cadastro de usuário"
          onConfirm={handleConfirm}
        >
          <form>
            <input type="text" placeholder="Nome completo" required />
            <input type="email" placeholder="E-mail" required />
            <select required>
              <option value="" disabled selected>
                Perfil
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <input type="password" placeholder="Senha" required />
          </form>
        </Modal>
      </div>
    </div>
  );
};

UserDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserDashboard;
