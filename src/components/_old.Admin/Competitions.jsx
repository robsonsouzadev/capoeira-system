import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function Competitions() {
  const [competitions, setCompetitions] = useState([])
  const [newComp, setNewComp] = useState('')

  useEffect(() => {
    const fetchCompetitions = async () => {
      const { data } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false })
      
      setCompetitions(data)
    }
    fetchCompetitions()
  }, [])

  const createCompetition = async () => {
    const { data, error } = await supabase
      .from('competitions')
      .insert([{ name: newComp }])
      .select()
    
    if (!error) {
      setCompetitions([data[0], ...competitions])
      setNewComp('')
    }
  }

  return (
    <div>
      <h2>Gerenciar Competições</h2>
      <div className="admin-form">
        <input
          value={newComp}
          onChange={(e) => setNewComp(e.target.value)}
          placeholder="Nova competição"
        />
        <button onClick={createCompetition}>Criar</button>
      </div>

      <div className="competitions-list">
        {competitions.map(comp => (
          <div key={comp.id} className="competition-card">
            <h3>{comp.name}</h3>
            <p>Data: {new Date(comp.start_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}