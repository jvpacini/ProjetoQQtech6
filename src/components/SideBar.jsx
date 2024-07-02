import { NavLink } from "react-router-dom";
import "./SideBar.css";
import useLogoutHandler from '../components/LogoutHandler';

function SideBar() {
  const items = [
    { name: "Usuários", url: "/" },
    { name: "Módulos", url: "/modules" },
    { name: "Transações", url: "/transactions" },
    { name: "Funções", url: "/functions" },
    { name: "Perfis", url: "/profiles" },
    { name: "Dashboard", url: "/dashboard" },
  ];

  const { handleLogout } = useLogoutHandler();

  return (
    <nav className="sidebar">
      <img
        src="/src/assets/logo.png"
        alt="Projeto BE-A-BA"
        className="logo"
      />
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
          src="/src/assets/logout_icon.png"
          alt="Logout"
          className="logout-icon"
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
}

export default SideBar;
