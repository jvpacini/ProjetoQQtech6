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
import CustomMultiSelect from "../components/CustomMultiSelect";

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
      alert("Por favor, selecione um usuário para remover.");
    }
  };

  const handleEditUserClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor, selecione um usuário para editar.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRow(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedRow(null); // Deseleciona a linha ao fechar o modal
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedRow(null); // Deseleciona a linha ao fechar o modal
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleConfirm = (selectedProfiles) => {
    // TODO: Lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    console.log("Perfis selecionados:", selectedProfiles);
    setIsModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    // TODO: Lógica de exclusão aqui
    if (selectedRow) {
      fetch(`http://localhost:8000/users/${selectedRow.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setUsers(users.filter((user) => user.id !== selectedRow.id));
            setSelectedRow(null);
          }
        })
        .catch((error) => console.error("Erro ao deletar usuário:", error));
    }
    setIsDeleteModalVisible(false);
  };

  const handleEditConfirm = (updatedUser) => {
    // TODO: Adicione a lógica de atualização aqui
    fetch(`http://localhost:8000/users/${updatedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          setUsers(
            users.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            )
          );
          setSelectedRow(null);
        }
      })
      .catch((error) => console.error("Erro ao atualizar usuário:", error));
    setIsEditModalVisible(false);
  };

  const userButtons = [
    { text: "Adicionar usuário", onClick: handleAddUserClick },
    { text: "Remover usuário", onClick: handleRemoveUserClick },
    { text: "Editar", onClick: handleEditUserClick },
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
      </AddUserModal>
      <DeleteUserModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Confirmação de Exclusão"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Nome", value: selectedRow.nome },
                { label: "Email", value: selectedRow.email },
              ]
            : []
        }
      />
      <EditUserModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar usuário"
        onConfirm={handleEditConfirm}
        userData={selectedRow ?? {}}
      />
    </div>
  );
};

UserDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserDashboard;
