import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);
    
    if (!error) alert('Perfil atualizado!');
  };

  return (
    <div className="profile-page">
      <h1>Meu Perfil</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          placeholder="Nome completo"
        />
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="url"
          value={profile.avatar_url}
          onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
          placeholder="URL da foto"
        />
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
}