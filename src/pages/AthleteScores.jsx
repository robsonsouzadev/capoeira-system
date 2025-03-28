import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AthleteScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from('scores')
        .select('*')
        .eq('athlete_id', user.id);
      
      setScores(data || []);
    };
    fetchScores();
  }, [user]);

  return (
    <div className="athlete-scores-page">
      <h1>Minhas Pontuações</h1>
      <div className="scores-list">
        {scores.map(score => (
          <div key={score.id} className="score-item">
            <span>Rodada {score.round_number}</span>
            <span className="score-value">{score.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}