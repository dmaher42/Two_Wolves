
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/auth/callback' } })
    if (!error) setSent(true)
  }

  return (
    <main className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Sign in</h2>
      {sent ? (
        <p>Check your inbox for a magic link.</p>
      ) : (
        <form onSubmit={signIn} className="space-y-3">
          <input className="w-full rounded border p-2" placeholder="you@school.sa.edu.au" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button className="rounded bg-[#0b3d91] px-4 py-2 text-white">Send link</button>
        </form>
      )}
    </main>
  )
}
