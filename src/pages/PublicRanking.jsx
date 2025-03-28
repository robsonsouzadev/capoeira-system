// pages/PublicRanking.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PublicRanking() {
  const [ranking, setRanking] = useState([]) // Inicialize como array vazio
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data, error } = await supabase
          .from('athlete_scores_view')
          .select('*')
          .order('total_score', { ascending: false })

        if (error) throw error
        
        // Garanta que data seja um array
        setRanking(data || [])
        
      } catch (error) {
        console.error('Erro ao buscar ranking:', error)
        setRanking([])
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()

    const channel = supabase
      .channel('ranking-updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, fetchRanking)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  if (loading) return <div className="loading">Carregando classificação...</div>

  return (
    <div className="ranking-page">
      <h1>Classificação Geral</h1>
      <div className="ranking-list">
        {/* Verificação de segurança */}
        {ranking?.length > 0 ? (
          ranking.map((athlete, index) => (
            <div key={athlete.id} className="ranking-item">
              <span className="position">#{index + 1}</span>
              <img 
                src={athlete.photo_url || '/default-avatar.png'} 
                alt={athlete.full_name}
                className="athlete-avatar"
              />
              <div className="athlete-info">
                <h3>{athlete.full_name}</h3>
                <p>Total: {athlete.total_score?.toFixed(1) || 0} pontos</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Nenhum resultado encontrado</p>
        )}
      </div>
    </div>
  )
}