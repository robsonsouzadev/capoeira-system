import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function AthleteProfile() {
  const [profile, setProfile] = useState({
    full_name: '',
    birth_date: '',
    photo_url: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()
      
      if (data) setProfile(data)
    }
    
    fetchProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', (await supabase.auth.getUser()).data.user.id)
    
    if (!error) alert('Perfil atualizado!')
    setLoading(false)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const { data, error } = await supabase.storage
      .from('athlete-photos')
      .upload(`${profile.id}/${file.name}`, file)
    
    if (!error) {
      const url = supabase.storage
        .from('athlete-photos')
        .getPublicUrl(data.path)
      
      setProfile({ ...profile, photo_url: url.data.publicUrl })
    }
  }

  return (
    <div className="athlete-profile">
      <h2>Meu Perfil</h2>
      
      <form onSubmit={handleUpdate}>
        <div className="photo-upload">
          <img 
            src={profile.photo_url || 'default-avatar.png'} 
            alt="Foto do perfil"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            id="photoInput"
          />
          <label htmlFor="photoInput">Alterar Foto</label>
        </div>

        <div className="form-group">
          <label>Nome Completo:</label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input
            type="date"
            value={profile.birth_date || ''}
            onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}