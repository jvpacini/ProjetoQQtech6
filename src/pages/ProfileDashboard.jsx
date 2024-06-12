import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DynamicTable from "../components/DynamicTable";
import Pagination from "../components/Pagination";
import ActionButtons from "../components/ActionButtons";
import AddProfileModal from "../components/AddProfileModal";
import DeleteModal from "../components/DeleteModal";
import EditProfileModal from "../components/EditProfileModal";
import Cover from "../components/Cover";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Dropdown from "../components/Dropdown";

const ProfileDashboard = ({ searchTerm, onSearch }) => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 8;

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

    setFilteredProfiles(filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  }, [profiles, searchTerm, selectedModule, currentPage]);

  const handleAddProfileClick = () => {
    setIsAddModalVisible(true);
  };

  const handleRemoveProfileClick = () => {
    if (selectedRow) {
      setIsDeleteModalVisible(true);
    } else {
      alert("Por favor, selecione um perfil para remover.");
    }
  };

  const handleEditProfileClick = () => {
    if (selectedRow) {
      setIsEditModalVisible(true);
    } else {
      alert("Por favor, selecione um perfil para editar.");
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedRow(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddConfirm = (newProfile) => {
    // TODO: Adicione a lógica de confirmação aqui, por exemplo, enviar os dados para o servidor
    fetch("http://localhost:8000/perfis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProfile),
    })
      .then((response) => response.json())
      .then((data) => {
        setProfiles([...profiles, data]);
        setIsAddModalVisible(false);
      })
      .catch((error) => console.error("Erro ao adicionar perfil:", error));
  };

  const handleDeleteConfirm = () => {
    // TODO: Lógica de exclusão aqui
    if (selectedRow) {
      fetch(`http://localhost:8000/perfis/${selectedRow.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setProfiles(profiles.filter((profile) => profile.id !== selectedRow.id));
            setSelectedRow(null);
          }
        })
        .catch((error) => console.error("Erro ao deletar perfil:", error));
    }
    setIsDeleteModalVisible(false);
  };

  const handleEditConfirm = (updatedProfile) => {
    // TODO: Adicione a lógica de atualização aqui
    fetch(`http://localhost:8000/perfis/${updatedProfile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (response.ok) {
          setProfiles(
            profiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile))
          );
          setSelectedRow(null);
        }
      })
      .catch((error) => console.error("Erro ao atualizar perfil:", error));
    setIsEditModalVisible(false);
  };

  const profileButtons = [
    { text: "Adicionar Perfil", onClick: handleAddProfileClick },
    { text: "Remover Perfil", onClick: handleRemoveProfileClick },
    { text: "Editar Perfil", onClick: handleEditProfileClick },
  ];

  const profileColumns = [
    { header: "ID", field: "id" },
    { header: "Nome", field: "nome" },
    { header: "Módulos", field: "modulos" },
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
        placeholder="Módulos"
      />
      <DynamicTable
        columns={profileColumns}
        data={filteredProfiles}
        maxRows={10}
        onRowClick={(row) => setSelectedRow(row)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ActionButtons buttons={profileButtons} />
      <Cover isVisible={isAddModalVisible || isDeleteModalVisible || isEditModalVisible} onClose={handleAddModalClose} />
      <AddProfileModal
        isVisible={isAddModalVisible}
        onClose={handleAddModalClose}
        title="Cadastro de Perfil"
        onConfirm={handleAddConfirm}
        fetchUrl="http://localhost:8000/modulos"
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onClose={handleDeleteModalClose}
        title="Confirmação de Exclusão"
        onConfirm={handleDeleteConfirm}
        fields={
          selectedRow
            ? [
                { label: "Nome", value: selectedRow.nome },
                { label: "Módulos", value: selectedRow.modulos.join(", ") },
              ]
            : []
        }
      />
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        title="Editar Perfil"
        onConfirm={handleEditConfirm}
        profileData={selectedRow}
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
