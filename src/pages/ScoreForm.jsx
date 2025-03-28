import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ScoreForm() {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchAthletes = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'athlete');
      
      setAthletes(data || []);
    };
    fetchAthletes();
  }, []);

  const handleSubmit = async (athleteId, score) => {
    const { error } = await supabase
      .from('scores')
      .insert({
        athlete_id: athleteId,
        judge_id: user.id,
        value: parseFloat(score)
      });
    
    if (!error) {
      setScores(prev => ({ ...prev, [athleteId]: '' }));
    }
  };

  return (
    <div className="score-form-page">
      <h1>Lançamento de Notas</h1>
      <div className="athletes-list">
        {athletes.map(athlete => (
          <div key={athlete.id} className="athlete-score">
            <span>{athlete.full_name}</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={scores[athlete.id] || ''}
              onChange={(e) => setScores({
                ...scores,
                [athlete.id]: e.target.value
              })}
            />
            <button onClick={() => handleSubmit(athlete.id, scores[athlete.id])}>
              Enviar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}