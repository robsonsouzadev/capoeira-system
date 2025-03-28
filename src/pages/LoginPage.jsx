import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'; // Adicione esta importação
import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  console.log('LoginPage está sendo renderizada!'); // Verifique no console
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login do Sistema</h1>
        <LoginForm />
      </div>
    </div>
  );
}