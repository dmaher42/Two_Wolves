
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function TaskPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft'|'submitted'>('draft')
  const [saving, setSaving] = useState<'idle'|'saving'|'saved'>('idle')

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    const { data: existing } = await supabase
      .from('submissions')
      .select('id, content, status')
      .eq('task_id', params.id)
      .eq('student_id', user.id)
      .maybeSingle()

    if (!existing) {
      await supabase.from('submissions').insert({ task_id: params.id, student_id: user.id, content: '' })
      setContent('')
    } else {
      setContent(existing.content || '')
      setStatus((existing.status as any) || 'draft')
    }
  }

  const saveDebounced = useDebouncedCallback(async (text: string) => {
    setSaving('saving')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('submissions')
      .update({ content: text, status })
      .eq('task_id', params.id)
      .eq('student_id', user.id)
    setSaving('saved')
    setTimeout(()=>setSaving('idle'), 800)
  }, 800)

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setContent(text)
    saveDebounced(text)
  }

  async function submitWork() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setStatus('submitted')
    await supabase.from('submissions')
      .update({ status: 'submitted' })
      .eq('task_id', params.id)
      .eq('student_id', user.id)
  }

  return (
    <main className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your response</h2>
        <div className="text-sm text-gray-600">{saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved' : ''}</div>
      </div>
      <textarea
        className="h-[50vh] w-full rounded border p-3 font-serif"
        placeholder="Write your response here…"
        value={content}
        onChange={onChange}
      />
      <div className="flex gap-2">
        <button onClick={submitWork} className="rounded bg-green-700 px-4 py-2 text-white">Submit</button>
        <a href="/student" className="rounded border px-4 py-2">Back</a>
      </div>
    </main>
  )
}
