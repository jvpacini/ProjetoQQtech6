import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import AddUserModal from "../components/AddUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import EditUserModal from "../components/EditUserModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Dropdown from "../components/Dropdown";
import api from "../services/api";
import Cookies from "js-cookie";

const UserDashboard = ({ searchTerm, onSearch }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 7;

  
  const fetchData = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("Token de autenticação não encontrado. Por favor fazer Login.");
      }
      const [usersResponse, profilesResponse] = await Promise.all([
        api.get("/usuarios"),
        api.get("/perfis"),
      ]);
      const profilesData = profilesResponse.data.reduce((acc, profile) => {
        acc[profile.id_perfil] = profile.nome_perfil; 
        return acc;
      }, {});
      const usersWithProfileNames = usersResponse.data.map((user) => ({
        ...user,
        perfilNome: profilesData[user.id_perfil] || "Sem perfil atribuído",
      }));
      const sortedUsers = usersWithProfileNames.sort((a, b) => a.id_usuario - b.id_usuario);
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setProfiles(profilesResponse.data);
    } catch (error) {
      console.error("Erro ao carregador dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProfile) {
      filtered = filtered.filter((user) => user.perfilNome === selectedProfile);
    }

    setFilteredUsers(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [users, searchTerm, selectedProfile, currentPage]);

  const handleAddUserClick = () => {
    setIsModalVisible(true);
  };

  const handleRemoveUserClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Por favor selecione um usuário para remover.");
    }
  };

  const handleEditUserClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor selecione um usuário para editar.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRow(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedRow(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedRow(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleConfirm = (selectedProfiles) => {
    console.log("Selected profiles:", selectedProfiles);
    fetchData();
    setIsModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    const currentUserId = Cookies.get('currentUserId');

    if(selectedRow.id_usuario === parseInt(currentUserId)) {
      alert("Você não pode deletar o usuário logado.");
      return;
    }
    
    if (selectedRow) {
      try {
        await api.delete(`/usuarios/${selectedRow.id_usuario}`);
        setUsers(
          users.filter((user) => user.id_usuario !== selectedRow.id_usuario)
        );
        setSelectedRow(null);
        fetchData();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const handleEditConfirm = async (updatedUser) => {
    try {
      await api.put(`/usuarios/${updatedUser.id_usuario}`, updatedUser);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setIsEditModalVisible(false);
  };

  const userButtons = [
    { text: "Adicionar Usuário", onClick: handleAddUserClick },
    { text: "Remover Usuário", onClick: handleRemoveUserClick },
    { text: "Editar Usuário", onClick: handleEditUserClick },
  ];

  const userColumns = [
    { header: "Código", field: "codigo_usuario" },
    { header: "Nome", field: "nome_completo" },
    { header: "Email", field: "email" },
    { header: "Perfil", field: "perfilNome" }, 
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Usuários</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <Dropdown
        options={profiles.map((profile) => profile.nome_perfil)}
        selectedOption={selectedProfile}
        onSelect={setSelectedProfile}
        placeholder="Todos os perfis"
      />
      <DynamicTable
        columns={userColumns}
        data={filteredUsers}
        maxRows={10}
        onRowClick={(row) => setSelectedRow(row)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={userButtons} />
      <Cover
        isVisible={isModalVisible || isDeleteModalVisible || isEditModalVisible}
        onClose={handleModalClose}
      />
      <AddUserModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title="Adicionar usuário"
        onConfirm={handleConfirm}
        fetchUrl="http://localhost:5050/api/perfis"
      />
      <DeleteUserModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Remover usuário"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Nome", value: selectedRow.nome_completo },
                { label: "Email", value: selectedRow.email },
              ]
            : []
        }
      />
      <EditUserModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar Usuário"
        onConfirm={handleEditConfirm}
        userData={selectedRow}
      />
    </div>
  );
};

UserDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserDashboard;
