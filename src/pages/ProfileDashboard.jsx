import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import AddProfileModal from "../components/AddProfileModal";
import EditProfileModal from "../components/EditProfileModal";
import DeleteModal from "../components/DeleteModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import Cookies from "js-cookie";

const ProfileDashboard = ({ searchTerm, onSearch }) => {
  const [profiles, setProfiles] = useState([]);
  const [modules, setModules] = useState([]);
  const [profileModules, setProfileModules] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
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
        const [profilesResponse, modulesResponse, profileModulesResponse] =
          await Promise.all([
            api.get("/perfis"),
            api.get("/modulos"),
            api.get("/perfil-modulos"),
          ]);

        const profilesData = profilesResponse.data;
        const modulesData = modulesResponse.data;
        const profileModulesData = profileModulesResponse.data;

        const profilesWithModules = profilesData.map((profile) => ({
          ...profile,
          modules: profileModulesData
            .filter((pm) => pm.id_perfil === profile.id_perfil)
            .map((pm) => {
              const module = modulesData.find(
                (m) => m.id_modulo === pm.id_modulo
              );
              return module ? module.codigo_modulo : null;
            })
            .filter(Boolean),
        }));

        setProfiles(profilesWithModules);
        setFilteredProfiles(profilesWithModules);
        setModules(modulesData);
        setProfileModules(profileModulesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter((profile) =>
        profile.nome_perfil.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfiles(
      filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    );
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [profiles, searchTerm, currentPage]);

  const handleAddProfileClick = () => {
    setIsAddModalVisible(true);
  };

  const handleRemoveProfileClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Please select a profile to remove.");
    }
  };

  const handleEditProfileClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Please select a profile to edit.");
    }
  };

  const handleModalClose = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedRow(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedRow(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddConfirm = async (newProfile) => {
    try {
      const response = await api.post("/perfis", newProfile);
      const newProfileData = response.data;
      const moduleAssociations = newProfile.modules.map((moduleId) => ({
        id_perfil: newProfileData.id_perfil,
        id_modulo: moduleId,
      }));
      await Promise.all(
        moduleAssociations.map((assoc) => api.post("/perfil-modulos", assoc))
      );
      setProfiles([...profiles, newProfileData]);
    } catch (error) {
      console.error("Error adding profile:", error);
    }
    setIsAddModalVisible(false);
  };

  const handleEditConfirm = async (updatedProfile) => {
    try {
      await api.put(`/perfis/${updatedProfile.id_perfil}`, updatedProfile);
      await api.delete(`/perfil-modulos/${updatedProfile.id_perfil}`);
      const moduleAssociations = updatedProfile.modules.map((moduleId) => ({
        id_perfil: updatedProfile.id_perfil,
        id_modulo: moduleId,
      }));
      await Promise.all(
        moduleAssociations.map((assoc) => api.post("/perfil-modulos", assoc))
      );
      setProfiles(
        profiles.map((profile) =>
          profile.id_perfil === updatedProfile.id_perfil
            ? updatedProfile
            : profile
        )
      );
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsEditModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      try {
        await api.delete(`/perfis/${selectedRow.id_perfil}`);
        await api.delete(`/perfil-modulos/${selectedRow.id_perfil}`);
        setProfiles(
          profiles.filter(
            (profile) => profile.id_perfil !== selectedRow.id_perfil
          )
        );
        setSelectedRow(null);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
    setIsDeleteModalVisible(false);
  };

  const profileButtons = [
    { text: "Add Profile", onClick: handleAddProfileClick },
    { text: "Remove Profile", onClick: handleRemoveProfileClick },
    { text: "Edit Profile", onClick: handleEditProfileClick },
  ];

  const profileColumns = [
    { header: "ID", field: "id_perfil" },
    { header: "Profile Name", field: "nome_perfil" },
    {
      header: "Modules",
      field: "modules",
      render: (modules) => modules.join(", "),
    },
  ];

  return (
    <div className="content">
      <SideBar />
      <h1>Profiles</h1>
      <SearchBar data={[]} onSearch={onSearch} />
      <DynamicTable
        columns={profileColumns}
        data={filteredProfiles}
        maxRows={10}
        onRowClick={(row) => {
          setSelectedRow({
            id_perfil: row.id_perfil,
            nome_perfil: row.nome_perfil,
            descricao: row.descricao,
          });
          console.log(row);
        }}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={profileButtons} />
      <Cover
        isVisible={
          isAddModalVisible || isEditModalVisible || isDeleteModalVisible
        }
        onClose={handleModalClose}
      />
      <AddProfileModal
        isVisible={isAddModalVisible}
        onClose={handleModalClose}
        title="Add Profile"
        onConfirm={handleAddConfirm}
        fetchUrl="http://localhost:5050/api/modulos"
      />
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        title="Edit Profile"
        onConfirm={handleEditConfirm}
        profileData={selectedRow}
        fetchUrl="http://localhost:5050/api/modulos"
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Delete Profile"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Profile Name", value: selectedRow.nome_perfil },
                { label: "Description", value: selectedRow.descricao },
              ]
            : []
        }
      />
    </div>
  );
};

ProfileDashboard.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default ProfileDashboard;
