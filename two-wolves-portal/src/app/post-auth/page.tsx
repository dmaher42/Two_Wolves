
'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { upsertSelf } from '@/lib/user'

export default function PostAuth() {
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await upsertSelf(user)
        window.location.href = '/student'
      } else {
        window.location.href = '/login'
      }
    })()
  }, [])
  return <p>Signing you in…</p>
}
