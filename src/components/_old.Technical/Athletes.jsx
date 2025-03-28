import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function TechnicalAthletes() {
  const [athletes, setAthletes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchAthletes = async () => {
      const { data: userData } = await supabase.auth.getUser()
      
      const { data } = await supabase
        .from('athlete_technical')
        .select(`
          athlete:profiles!athlete_technical_athlete_id_fkey(
            id,
            full_name,
            photo_url,
            scores: scores!athlete_id (
              value,
              round_number
            )
          )
        `)
        .eq('technical_id', userData.user.id)
      
      setAthletes(data?.map(item => item.athlete) || [])
    }
    
    fetchAthletes()
  }, [])

  const filteredAthletes = athletes.filter(athlete =>
    athlete.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="technical-view">
      <h2>Meus Atletas</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar atleta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="athletes-list">
        {filteredAthletes.map(athlete => (
          <div key={athlete.id} className="athlete-card">
            <img 
              src={athlete.photo_url || 'default-avatar.png'} 
              alt={athlete.full_name}
            />
            <div className="athlete-info">
              <h3>{athlete.full_name}</h3>
              
              <div className="scores">
                {athlete.scores?.map((score, index) => (
                  <div key={index} className="score-item">
                    <span>Rodada {score.round_number}</span>
                    <span className="score">{score.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}