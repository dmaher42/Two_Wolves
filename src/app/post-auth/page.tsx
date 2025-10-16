'use client'

import { useEffect } from 'react'
import { getCurrentUser } from '../../lib/portal-data'

export default function PostAuth() {
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    window.location.href = user.role === 'teacher' ? '/teacher' : '/student'
  }, [])

  return <p>Signing you in…</p>
}
