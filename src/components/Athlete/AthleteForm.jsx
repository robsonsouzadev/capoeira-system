import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function AthleteForm() {
  const { user } = useAuth();
  const [athlete, setAthlete] = useState({
    full_name: '',
    birth_date: '',
    avatar_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: athlete.full_name,
        birth_date: athlete.birth_date,
        avatar_url: athlete.avatar_url
      })
      .eq('id', athlete.id);

    if (!error) {
      alert('Atleta salvo com sucesso!');
      setAthlete({ full_name: '', birth_date: '', avatar_url: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="athlete-form">
      <div className="form-group">
        <label>Nome Completo:</label>
        <input
          type="text"
          value={athlete.full_name}
          onChange={(e) => setAthlete({ ...athlete, full_name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Data de Nascimento:</label>
        <input
          type="date"
          value={athlete.birth_date}
          onChange={(e) => setAthlete({ ...athlete, birth_date: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>URL da Foto:</label>
        <input
          type="url"
          value={athlete.avatar_url}
          onChange={(e) => setAthlete({ ...athlete, avatar_url: e.target.value })}
          placeholder="https://exemplo.com/foto.jpg"
        />
      </div>

      <button type="submit" className="submit-button">
        Salvar Atleta
      </button>
    </form>
  );
}