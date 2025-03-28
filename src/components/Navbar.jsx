import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/'); // Redireciona para a página de login após logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Sistema Capoeira</Link>
      </div>
      
      {user && (
        <div className="nav-links">
          {/* Menu Admin */}
          {user.role === 'admin' && (
            <>
              <Link to="/cadastro/atletas">Atletas</Link>
              <Link to="/cadastro/competicoes">Competições</Link>
              <Link to="/cadastro/categorias">Categorias</Link>
              <Link to="/cadastro/rodadas">Rodadas</Link>
            </>
          )}

          {/* Menu Juiz */}
          {user.role === 'judge' && (
            <Link to="/lancar-notas">Lançar Notas</Link>
          )}

          {/* Menu Técnico */}
          {user.role === 'technical' && (
            <Link to="/meus-atletas">Meus Atletas</Link>
          )}

          {/* Menu Atleta */}
          {user.role === 'athlete' && (
            <Link to="/minhas-pontuacoes">Minhas Pontuações</Link>
          )}

          {/* Menu Geral */}
          <Link to="/perfil">Meu Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </nav>
  );
}