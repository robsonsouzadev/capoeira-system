// components/Athlete/Scores.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function AthleteScores() {
  const [scores, setScores] = useState([]) // Inicialize sempre como array
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        setUser(userData.user)

        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select('*')
          .eq('athlete_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (scoresError) throw scoresError

        // Garanta que scoresData seja um array
        setScores(scoresData || [])
        
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setScores([]) // Defina como array vazio em caso de erro
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div className="athlete-view">
      <h2>Suas Pontuações</h2>
      
      {/* Verificação extra de segurança */}
      {scores?.length > 0 ? (
        <div className="scores-list">
          {scores.map(score => (
            <div key={score.id} className="score-item">
              <span>Rodada {score.round_number}</span>
              <span className="score-value">{score.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma pontuação registrada ainda.</p>
      )}
    </div>
  )
}