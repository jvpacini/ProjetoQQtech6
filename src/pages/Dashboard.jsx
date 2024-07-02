import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import DashboardBox from "../components/DashboardBox";
import userIcon from "../assets/user_icon_template.png";
import transactionIcon from "../assets/transaction_icon.png";
import functionIcon from "../assets/gear_icon.png";
import ProfileDistributionChart from "../components/ProfileChart";
import api from "../services/api"; // Import the axiosInstance

const Dashboard = () => {
  const [profileCount, setProfileCount] = useState(0);
  const [functionCount, setFunctionCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);

  useEffect(() => {
    api
      .get("/usuarios")
      .then((response) => setUserCount(response.data.length))
      .catch((error) => console.error("Erro ao carregar usuários:", error));

    api
      .get("/perfis")
      .then((response) => setProfileCount(response.data.length))
      .catch((error) => console.error("Erro ao carregar usuários:", error));

    api
      .get("/transacoes")
      .then((response) => setTransactionCount(response.data.length))
      .catch((error) => console.error("Erro ao carregar transações:", error));

    api
      .get("/modulos")
      .then((response) => setModuleCount(response.data.length))
      .catch((error) => console.error("Erro ao carregar módulos:", error));

    api
      .get("/funcoes")
      .then((response) => setFunctionCount(response.data.length))
      .catch((error) => console.error("Erro ao carregar funções:", error));
  }, []);

  return (
    <div className="content">
      <SideBar />
      <div className="dashboard-container">
        <div className="dashboard-info">
          <h1>Dashboard</h1>
          <DashboardBox
            icon={userIcon}
            title="Usuários"
            subtitle={`Total de usuários: ${
              userCount !== 0 ? userCount : "Carregando..."
            }`}
          />
          <DashboardBox
            icon={userIcon}
            title="Perfis"
            subtitle={`Total de perfis: ${
              profileCount !== 0 ? profileCount : "Carregando..."
            }`}
          />
          <DashboardBox
            icon={functionIcon}
            title="Funções"
            subtitle={`Total de funções: ${
              functionCount !== 0 ? functionCount : "Carregando..."
            }`}
          />
          <DashboardBox
            icon={transactionIcon}
            title="Transações"
            subtitle={`Total de transações: ${
              transactionCount !== 0 ? transactionCount : "Carregando..."
            }`}
          />
          <DashboardBox
            icon={functionIcon}
            title="Módulos"
            subtitle={`Total de módulos: ${
              moduleCount !== 0 ? moduleCount : "Carregando..."
            }`}
          />
        </div>
        <div className="dashboard-chart">
          <ProfileDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
