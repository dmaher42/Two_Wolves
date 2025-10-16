'use client'

import { useState } from 'react'
import { PortalRole, setCurrentUser } from '../../lib/portal-data'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<PortalRole>('student')
  const [sent, setSent] = useState(false)

  function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    const trimmed = email.trim().toLowerCase()
    setCurrentUser({ email: trimmed, role })
    setSent(true)
    const redirect = role === 'teacher' ? '/teacher' : '/student'
    window.setTimeout(() => {
      window.location.href = redirect
    }, 600)
  }

  return (
    <main className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Sign in</h2>
      {sent ? (
        <p className="rounded border bg-white p-3">You're all set! Redirecting you now…</p>
      ) : (
        <form onSubmit={signIn} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            School email
            <input
              className="mt-1 w-full rounded border p-2"
              placeholder="you@school.sa.edu.au"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <fieldset className="space-y-1">
            <legend className="text-sm font-medium text-gray-700">Sign in as</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === 'teacher'}
                onChange={() => setRole('teacher')}
              />
              Teacher
            </label>
          </fieldset>
          <button className="rounded bg-[#0b3d91] px-4 py-2 text-white">Continue</button>
        </form>
      )}
    </main>
  )
}
