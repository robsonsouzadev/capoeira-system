import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Bem-vindo, {user?.full_name}</h1>
      <div className="dashboard-content">
        <p>Selecione uma opção no menu acima</p>
      </div>
    </div>
  );
}