import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import api from "../services/api";

const ProfileChart = () => {
  const [chartData, setChartData] = useState({});
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Fetch profiles
    api.get("/perfis")
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Erro ao carregar perfis:", error));
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      // Fetch users only after profiles have been fetched
      api.get('/usuarios')
        .then(response => {
          const users = response.data;
          const profileMap = profiles.reduce((map, profile) => {
            map[profile.id_perfil] = profile.nome_perfil;
            return map;
          }, {});

          const profileTypes = {};
          users.forEach(user => {
            const profile = user.id_perfil ? profileMap[user.id_perfil] : "Sem perfil atribuído";
            profileTypes[profile] = (profileTypes[profile] || 0) + 1;
          });

          const labels = Object.keys(profileTypes);
          const data = Object.values(profileTypes);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Quantidade de usuários',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(199, 199, 199, 0.2)', // Color for "Sem perfil atribuído"
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(159, 159, 159, 1)', // Color for "Sem perfil atribuído"
                ],
                borderWidth: 1,
              },
            ],
          });
        })
        .catch(error => console.error('Erro ao buscar dados do backend:', error));
    }
  }, [profiles]); // Dependency on profiles to ensure profiles are loaded first

  return (
    <div style={{ width: '625px', height: '625px', marginLeft: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
      <h1>Distribuição de Perfis de Usuários</h1>
      {chartData.labels ? (
        <Pie data={chartData} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default ProfileChart;
