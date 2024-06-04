import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar() {
  const items = [
    { name: "Usuários", url: "/users" },
    { name: "Módulos", url: "/modules" },
    { name: "Transações", url: "/transactions" },
    { name: "Funções", url: "/functions" },
    { name: "Perfis", url: "/profiles" },
    { name: "Dashboard", url: "/" },
  ];

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
        <img
          src="/src/assets/profile_picture.png"
          alt="Perfil"
          className="profile-picture"
        />
        <span>João Paulo Cardoso</span>
        <img
          src="/src/assets/logout_icon.png"
          alt="Logout"
          className="logout-icon"
        />
      </div>
    </nav>
  );
}

export default SideBar;
