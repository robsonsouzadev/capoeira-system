import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function TechnicalView() {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    const fetchAthletes = async () => {
      const { data } = await supabase
        .from('athlete_technical')
        .select('athlete:profiles(*)')
        .eq('technical_id', user.id);
      
      setAthletes(data?.map(item => item.athlete) || []);
    };
    
    fetchAthletes();
  }, [user]);

  return (
    <div className="technical-view-page">
      <h1>Meus Atletas</h1>
      <div className="athletes-list">
        {athletes.map(athlete => (
          <div key={athlete.id} className="athlete-card">
            <img src={athlete.avatar_url} alt={athlete.full_name} />
            <h3>{athlete.full_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}