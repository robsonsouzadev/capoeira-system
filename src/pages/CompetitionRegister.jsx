import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CompetitionRegister() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('competitions')
      .insert([{ name, start_date: startDate, end_date: endDate }]);
    
    if (!error) {
      setName('');
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="competition-register">
      <h1>Nova Competição</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da competição"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}