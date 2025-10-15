
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

type Task = { id: string; title: string; content: string | null }

export default function StudentHome() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase
        .from('tasks')
        .select('id,title,content')
        .eq('published', true)
        .order('created_at', { ascending: false })
      setTasks(data || [])
    })()
  }, [])

  return (
    <main className="space-y-4">
      <h2 className="text-lg font-semibold">Today’s tasks</h2>
      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="rounded border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{t.content || ''}</p>
              </div>
              <a className="rounded bg-[#0b3d91] px-3 py-1 text-white" href={`/task/${t.id}`}>Start</a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
