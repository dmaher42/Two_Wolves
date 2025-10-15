'use client'

import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
  ensureSubmission,
  findTask,
  getCurrentUser,
  PortalSubmission,
  PortalTask,
  updateSubmission,
} from '../../../lib/portal-data'

export default function TaskPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<PortalTask | null>(null)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'submitted'>('draft')
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    const currentTask = findTask(params.id)
    if (!currentTask) {
      window.location.href = '/student'
      return
    }
    setTask(currentTask)
    const existing = ensureSubmission(params.id, user.email)
    setContent(existing.content || '')
    setStatus(existing.status)
  }, [params.id])

  const saveDebounced = useDebouncedCallback(async (text: string, nextStatus: PortalSubmission['status']) => {
    setSaving('saving')
    const user = getCurrentUser()
    if (!user) return
    updateSubmission(params.id, user.email, { content: text, status: nextStatus })
    setSaving('saved')
    window.setTimeout(() => setSaving('idle'), 800)
  }, 800)

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setContent(text)
    saveDebounced(text, status)
  }

  function submitWork() {
    const user = getCurrentUser()
    if (!user) return
    if ('flush' in saveDebounced) {
      ;(saveDebounced as any).flush?.()
    }
    setStatus('submitted')
    updateSubmission(params.id, user.email, { status: 'submitted', content })
  }

  if (!task) return <p>Loading…</p>

  return (
    <main className="space-y-4">
      <div className="rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{task.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your response</h3>
        <div className="text-sm text-gray-600">
          {saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved' : ''}
        </div>
      </div>
      <textarea
        className="h-[50vh] w-full rounded border p-3 font-serif"
        placeholder="Write your response here…"
        value={content}
        onChange={onChange}
      />
      <div className="flex gap-2">
        <button onClick={submitWork} className="rounded bg-green-700 px-4 py-2 text-white">
          Submit
        </button>
        <a href="/student" className="rounded border px-4 py-2">
          Back
        </a>
      </div>
    </main>
  )
}
