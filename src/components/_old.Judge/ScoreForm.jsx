import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function ScoreForm() {
  const [athletes, setAthletes] = useState([])
  const [scores, setScores] = useState({})
  const [currentRound, setCurrentRound] = useState(1)

  useEffect(() => {
    const fetchAthletes = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'athlete')
      
      setAthletes(data)
    }
    fetchAthletes()
  }, [])

  const submitScores = async () => {
    for (const athlete of athletes) {
      await supabase
        .from('scores')
        .insert({
          athlete_id: athlete.id,
          judge_id: (await supabase.auth.getUser()).data.user.id,
          value: scores[athlete.id],
          round_number: currentRound
        })
    }
    alert('Notas enviadas com sucesso!')
  }

  return (
    <div className="judge-panel">
      <h2>Rodada {currentRound}</h2>
      <div className="athletes-list">
        {athletes.map(athlete => (
          <div key={athlete.id} className="athlete-score">
            <span>{athlete.full_name}</span>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={scores[athlete.id] || ''}
              onChange={(e) => setScores({
                ...scores,
                [athlete.id]: e.target.value
              })}
            />
          </div>
        ))}
      </div>
      <button onClick={submitScores}>Salvar Todas as Notas</button>
    </div>
  )
}