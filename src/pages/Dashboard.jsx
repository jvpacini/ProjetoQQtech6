import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import DashboardBox from "../components/DashboardBox";
import userIcon from "../assets/user_icon_template.png"; 
import transactionIcon from "../assets/transaction_icon.png"; 
import functionIcon from "../assets/gear_icon.png"; 

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
        <h1>Dashboard</h1>
        <DashboardBox
          icon={userIcon}
          title="Usuários"
          subtitle={`Total de usuários: ${userCount}`}
        />
        <DashboardBox
          icon={transactionIcon}
          title="Transações"
          subtitle={`Total de transações: ${transactionCount}`}
        />
        <DashboardBox
          icon={functionIcon}
          title="Módulos"
          subtitle={`Total de módulos: ${moduleCount}`}
        />
        {/* Aqui terá espaço para o gráfico */}
    </div>
  );
};

export default Dashboard;
