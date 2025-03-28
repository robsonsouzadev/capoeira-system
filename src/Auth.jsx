import { Auth } from '@supabase/auth-ui-react'
import { supabase } from './supabaseClient'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthForm() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
      view="magic_link"
    />
  )
}