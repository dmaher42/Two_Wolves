
'use client'
import { supabase } from '../../../two-wolves-portal/src/lib/supabaseClient'
import { useEffect, useState } from 'react'

type Task = { id: string; title: string; content: string | null }

enum View { Tasks, Progress }

export default function TeacherPage() {
  const [roleOk, setRoleOk] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [view, setView] = useState<View>(View.Tasks)
  const [progress, setProgress] = useState<any[]>([])

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('users').upsert({ id: user.id, role: 'teacher' })
    setRoleOk(true)
    await refresh()
  }

  async function refresh() {
    const { data: tasks } = await supabase.from('tasks').select('id,title,content').order('created_at', { ascending: false })
    setTasks(tasks || [])
    const { data: prog } = await supabase
      .from('submissions')
      .select('status, updated_at, student_id, task_id')
      .order('updated_at', { ascending: false })
    setProgress(prog || [])
  }

  async function createTask() {
    await supabase.from('tasks').insert({ title, content, class_id: await anyClassId() })
    setTitle(''); setContent(''); await refresh()
  }

  async function anyClassId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: classes } = await supabase.from('classes').select('id').eq('teacher_id', user!.id).limit(1)
    if (classes && classes.length) return classes[0].id
    const { data: created } = await supabase
      .from('classes')
      .insert({ name: 'Year 7 — Two Wolves', code: 'Y7-2W', teacher_id: user!.id })
      .select('id').single()
    return created!.id
  }

  if (!roleOk) return <p>Loading…</p>

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Teacher</h2>
        <button onClick={refresh} className="rounded border px-3 py-1">Refresh</button>
      </div>

      <section className="rounded border bg-white p-4">
        <h3 className="font-medium">New task</h3>
        <input className="mt-2 w-full rounded border p-2" placeholder="Title (e.g., TEEL: Quote Analysis)" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="mt-2 h-32 w-full rounded border p-2" placeholder="Student instructions…" value={content} onChange={e=>setContent(e.target.value)} />
        <button onClick={createTask} className="mt-2 rounded bg-black px-3 py-2 text-white">Create task</button>
      </section>

      <div className="flex gap-2">
        <button className={`rounded px-3 py-1 ${view===View.Tasks?'bg-black text-white':'border'}`} onClick={()=>setView(View.Tasks)}>Tasks</button>
        <button className={`rounded px-3 py-1 ${view===View.Progress?'bg-black text-white':'border'}`} onClick={()=>setView(View.Progress)}>Progress</button>
      </div>

      {view===View.Tasks ? (
        <ul className="space-y-2">
          {tasks.map(t => (
            <li key={t.id} className="rounded border bg-white p-4">
              <div className="font-medium">{t.title}</div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{t.content || ''}</p>
            </li>
          ))}
        </ul>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left"><th className="p-2">Student</th><th className="p-2">Task</th><th className="p-2">Status</th><th className="p-2">Updated</th></tr>
          </thead>
          <tbody>
            {progress.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{p.student_id.slice(0,6)}…</td>
                <td className="p-2">{p.task_id.slice(0,6)}…</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{new Date(p.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
