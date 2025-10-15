
"use client"
import { useState } from 'react'

type Task = { id: string; title: string; content: string | null }

enum View { Tasks, Progress }

export default function TeacherPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [view, setView] = useState<View>(View.Tasks)
  const [progress, setProgress] = useState<any[]>([])

  // supabase removed: add your own logic here if needed

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Teacher</h2>
        {/* Refresh button removed */}
      </div>

      <section className="rounded border bg-white p-4">
        <h3 className="font-medium">New task</h3>
        <input className="mt-2 w-full rounded border p-2" placeholder="Title (e.g., TEEL: Quote Analysis)" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="mt-2 h-32 w-full rounded border p-2" placeholder="Student instructions…" value={content} onChange={e=>setContent(e.target.value)} />
        {/* Create task button removed */}
      </section>

      <div className="flex gap-2">
        <button className={`rounded px-3 py-1 ${view===View.Tasks?'bg-[#0b3d91] text-white':'border'}`} onClick={()=>setView(View.Tasks)}>Tasks</button>
        <button className={`rounded px-3 py-1 ${view===View.Progress?'bg-[#0b3d91] text-white':'border'}`} onClick={()=>setView(View.Progress)}>Progress</button>
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
