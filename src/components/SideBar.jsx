import { NavLink } from "react-router-dom";
import "./SideBar.css";
import useLogoutHandler from "../components/LogoutHandler";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import api from "../services/api";

function SideBar() {
  const items = [
    { name: "Usuários", url: "/" },
    { name: "Perfis", url: "/profiles" },
    { name: "Módulos", url: "/modules" },
    { name: "Transações", url: "/transactions" },
    { name: "Funções", url: "/functions" },
    { name: "Relatórios", url: "/dashboard" },
  ];
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const idFromCookie = Cookies.get("currentUserId");
    if (idFromCookie) {
      api
        .get(`/usuarios/${idFromCookie}`)
        .then((response) => {
          setUserName(response.data.nome_completo);
        })
        .catch((error) => console.error("Erro ao carregar usuário:", error));
    }
  }, []);

  const { handleLogout } = useLogoutHandler();

  return (
    <nav className="sidebar">
      <img src="/src/assets/logo.png" alt="Projeto BE-A-BA" className="logo" />
      {items.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          className={({ isActive }) =>
            "nav-button" + (isActive ? " active" : "")
          }
        >
          {item.name}
        </NavLink>
      ))}
      <div className="profile-section">
        <div className="user-info">
          <p>{userName ? (userName.length > 20 ? userName.split(' ')[0] : userName) : "Carregando..."}</p>
          <img
            src="/src/assets/logout_icon.png"
            alt="Logout"
            className="logout-icon"
            onClick={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
