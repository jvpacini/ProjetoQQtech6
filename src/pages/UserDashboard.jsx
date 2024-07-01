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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
        const [usersResponse, profilesResponse] = await Promise.all([
          api.get("/usuarios"),
          api.get("/perfis"),
        ]);
        const profilesData = profilesResponse.data.reduce((acc, profile) => {
          acc[profile.id_perfil] = profile.nome_perfil; // Adjusted field names based on schema
          return acc;
        }, {});
        const usersWithProfileNames = usersResponse.data.map((user) => ({
          ...user,
          perfilNome: profilesData[user.id_perfil] || "N/A", // Map profile ID to profile name
        }));
        setUsers(usersWithProfileNames);
        setFilteredUsers(usersWithProfileNames);
        setProfiles(profilesResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
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
      alert("Please select a user to remove.");
    }
  };

  const handleEditUserClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Please select a user to edit.");
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
    setIsModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      try {
        await api.delete(`/usuarios/${selectedRow.id_usuario}`);
        setUsers(
          users.filter((user) => user.id_usuario !== selectedRow.id_usuario)
        );
        setSelectedRow(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const handleEditConfirm = async (updatedUser) => {
    try {
      await api.put(`/usuarios/${updatedUser.id_usuario}`, updatedUser);
      setUsers(
        users.map((user) =>
          user.id_usuario === updatedUser.id_usuario ? updatedUser : user
        )
      );
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setIsEditModalVisible(false);
  };

  const userButtons = [
    { text: "Add User", onClick: handleAddUserClick },
    { text: "Remove User", onClick: handleRemoveUserClick },
    { text: "Edit", onClick: handleEditUserClick },
  ];

  const userColumns = [
    { header: "Código", field: "codigo_usuario" },
    { header: "Nome", field: "nome_completo" },
    { header: "Email", field: "email" },
    { header: "Perfil", field: "perfilNome" }, // Use perfilNome to display profile name
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Users</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <Dropdown
        options={profiles.map((profile) => profile.nome_perfil)}
        selectedOption={selectedProfile}
        onSelect={setSelectedProfile}
        placeholder="All profiles"
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
        title="Add User"
        onConfirm={handleConfirm}
        fetchUrl="http://localhost:5050/api/perfis"
      >
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <CustomMultiSelect
            placeholder="Profiles"
            fetchUrl="http://localhost:5050/api/perfis"
            onChange={(selected) => console.log(selected)}
          />
          <input type="password" placeholder="Password" required />
        </form>
      </AddUserModal>
      <DeleteUserModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Delete Confirmation"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Name", value: selectedRow.nome_completo },
                { label: "Email", value: selectedRow.email },
              ]
            : []
        }
      />
      <EditUserModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Edit User"
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
