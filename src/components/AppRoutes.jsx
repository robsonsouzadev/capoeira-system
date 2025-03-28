// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import AthleteRegister from '../pages/AthleteRegister';
import CompetitionRegister from '../pages/CompetitionRegister';
import CategoryRegister from '../pages/CategoryRegister';
import RoundRegister from '../pages/RoundRegister';
import ScoreForm from '../pages/ScoreForm';
import TechnicalView from '../pages/TechnicalView';
import AthleteScores from '../pages/AthleteScores';
import ProfilePage from '../pages/ProfilePage';
import NotFound from '../pages/NotFound'; // Crie este componente básico se necessário

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rota raiz - redireciona conforme autenticação */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />

      {/* Dashboard principal */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin', 'judge', 'technical', 'athlete']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Rotas de Admin */}
      <Route path="/cadastro/atletas" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AthleteRegister />
        </ProtectedRoute>
      } />

      <Route path="/cadastro/competicoes" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CompetitionRegister />
        </ProtectedRoute>
      } />

      <Route path="/cadastro/categorias" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CategoryRegister />
        </ProtectedRoute>
      } />

      <Route path="/cadastro/rodadas" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <RoundRegister />
        </ProtectedRoute>
      } />

      {/* Rota de Juiz */}
      <Route path="/lancar-notas" element={
        <ProtectedRoute allowedRoles={['judge']}>
          <ScoreForm />
        </ProtectedRoute>
      } />

      {/* Rota de Técnico */}
      <Route path="/meus-atletas" element={
        <ProtectedRoute allowedRoles={['technical']}>
          <TechnicalView />
        </ProtectedRoute>
      } />

      {/* Rota de Atleta */}
      <Route path="/minhas-pontuacoes" element={
        <ProtectedRoute allowedRoles={['athlete']}>
          <AthleteScores />
        </ProtectedRoute>
      } />

      {/* Perfil geral */}
      <Route path="/perfil" element={
        <ProtectedRoute allowedRoles={['admin', 'judge', 'technical', 'athlete']}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}