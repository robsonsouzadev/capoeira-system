// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { roles } from '../config/permissions'; // Arquivo de configuração de permissões

// 1. Criação do Contexto de Autenticação
const AuthContext = createContext();

// 2. Provedor de Autenticação (envolve toda a aplicação)
export const AuthProvider = ({ children }) => {
  // Estado para armazenar dados do usuário
  const [user, setUser] = useState(null);
  // Estado para controlar o carregamento inicial
  const [loading, setLoading] = useState(true);

  // 3. Efeito para gerenciar sessão e listener de autenticação
  useEffect(() => {
    let isMounted = true; // Controle de montagem do componente

    // Função para obter sessão do usuário
    const getSession = async () => {
      try {
        // Busca sessão atual do Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return; // Evita atualização se componente desmontado
        
        if (error) throw error;

        if (session?.user) {
          // Busca perfil completo do usuário
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Combina dados de autenticação com perfil
          setUser({ ...session.user, ...profile });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao buscar sessão:', error);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        if (session?.user) {
          // Atualiza dados do usuário quando houver mudanças
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({ ...session.user, ...profile });
        } else {
          // Limpa usuário no logout
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Inicializa verificação de sessão
    getSession();

    // Cleanup: Remove listener e marca componente como desmontado
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 4. Função de Login
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // 5. Função de Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // 6. Sistema de Permissões (NOVO)
  const hasPermission = (requiredPermission) => {
    if (!user) return false; // Usuário não autenticado
    
    // Administradores têm acesso total
    if (user.role === 'admin') return true;
    
    // Busca configuração da role do usuário
    const roleConfig = roles[user.role];
    
    // Verifica se a permissão está incluída ou tem acesso total
    return roleConfig?.access.includes(requiredPermission) || 
           roleConfig?.access.includes('*');
  };

  // 7. Valor disponibilizado pelo contexto
  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission // Exporta função de verificação
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Renderiza children apenas após carregamento inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 8. Hook personalizado para uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};