import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function Categories() {
  const [competitions, setCompetitions] = useState([])
  const [selectedCompetition, setSelectedCompetition] = useState(null)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const fetchCompetitions = async () => {
      const { data } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false })
      
      setCompetitions(data)
      if (data?.length > 0) setSelectedCompetition(data[0].id)
    }
    fetchCompetitions()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedCompetition) return
      
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('competition_id', selectedCompetition)
      
      setCategories(data || [])
    }
    fetchCategories()
  }, [selectedCompetition])

  const createCategory = async () => {
    if (!newCategory.trim()) return
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        name: newCategory,
        competition_id: selectedCompetition 
      }])
      .select()

    if (!error) {
      setCategories([...categories, data[0]])
      setNewCategory('')
    }
  }

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
    
    if (!error) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  return (
    <div className="admin-categories">
      <h2>Gerenciar Categorias</h2>
      
      <div className="competition-selector">
        <select 
          value={selectedCompetition || ''}
          onChange={(e) => setSelectedCompetition(e.target.value)}
        >
          {competitions.map(comp => (
            <option key={comp.id} value={comp.id}>
              {comp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="category-form">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nova categoria"
        />
        <button onClick={createCategory}>Adicionar</button>
      </div>

      <div className="categories-list">
        {categories.map(cat => (
          <div key={cat.id} className="category-item">
            <span>{cat.name}</span>
            <button 
              onClick={() => deleteCategory(cat.id)}
              className="delete-btn"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}