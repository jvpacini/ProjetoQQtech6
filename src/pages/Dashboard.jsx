import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import DashboardBox from "../components/DashboardBox";
import userIcon from "../assets/user_icon_template.png"; 
import transactionIcon from "../assets/transaction_icon.png"; 
import functionIcon from "../assets/gear_icon.png"; 
import ProfileDistributionChart from "../components/ProfileChart";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((response) => response.json())
      .then((data) => setUserCount(data.length))
      .catch((error) => console.error("Erro ao carregar usuários:", error));

    fetch("http://localhost:8000/transacoes")
      .then((response) => response.json())
      .then((data) => setTransactionCount(data.length))
      .catch((error) => console.error("Erro ao carregar transações:", error));

    fetch("http://localhost:8000/modulos")
      .then((response) => response.json())
      .then((data) => setModuleCount(data.length))
      .catch((error) => console.error("Erro ao carregar módulos:", error));
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
            subtitle={`Total de usuários: ${userCount != 0 ? userCount : "Carregando..."}`}
          />
          <DashboardBox
            icon={transactionIcon}
            title="Transações"
            subtitle={`Total de transações: ${transactionCount != 0 ? transactionCount : "Carregando..."}`}
          />
          <DashboardBox
            icon={functionIcon}
            title="Módulos"
            subtitle={`Total de módulos: ${moduleCount != 0 ? moduleCount : "Carregando..."}`}
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
