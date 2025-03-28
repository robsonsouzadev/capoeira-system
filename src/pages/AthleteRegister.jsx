// import { useAuth } from '../context/AuthContext';
// import AthleteForm from '../components/Athlete/AthleteForm';

// export default function AthleteRegister() {
//   const { hasPermission } = useAuth();

//   if (!hasPermission('gerenciar:atletas')) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return (
//     <div className="athlete-register-page">
//       <h1>Cadastro de Atletas</h1>
//       <AthleteForm />
//     </div>
//   );
// }

// Exemplo
export default function CategoryRegister() {
  return (
    <div className="page-container">
      <h1>Cadastro de Categorias</h1>
      {/* Adicione sua lógica aqui */}
    </div>
  );
}