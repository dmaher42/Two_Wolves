'use client'

import { useEffect, useState } from 'react'
import {
  createTask,
  getCurrentUser,
  listSubmissions,
  listTasks,
  PortalSubmission,
  PortalTask,
  setCurrentUser,
} from '../../lib/portal-data'

enum View {
  Tasks,
  Progress,
}

export default function TeacherPage() {
  const [roleOk, setRoleOk] = useState(false)
  const [tasks, setTasks] = useState<PortalTask[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [view, setView] = useState<View>(View.Tasks)
  const [progress, setProgress] = useState<PortalSubmission[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (user.role !== 'teacher') {
      setCurrentUser({ ...user, role: 'teacher' })
    }
    setRoleOk(true)
    refresh()
  }, [])

  function refresh() {
    setTasks(listTasks())
    setProgress(listSubmissions())
  }

  function createNewTask() {
    if (!title.trim()) return
    createTask(title.trim(), content.trim())
    setTitle('')
    setContent('')
    refresh()
  }

  if (!roleOk) return <p>Loading…</p>

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Teacher</h2>
        <button onClick={refresh} className="rounded border px-3 py-1">
          Refresh
        </button>
      </div>

      <section className="rounded border bg-white p-4">
        <h3 className="font-medium">New task</h3>
        <input
          className="mt-2 w-full rounded border p-2"
          placeholder="Title (e.g., TEEL: Quote Analysis)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="mt-2 h-32 w-full rounded border p-2"
          placeholder="Student instructions…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={createNewTask} className="mt-2 rounded bg-[#0b3d91] px-3 py-2 text-white">
          Create task
        </button>
      </section>

      <div className="flex gap-2">
        <button
          className={`rounded px-3 py-1 ${view === View.Tasks ? 'bg-[#0b3d91] text-white' : 'border'}`}
          onClick={() => setView(View.Tasks)}
        >
          Tasks
        </button>
        <button
          className={`rounded px-3 py-1 ${view === View.Progress ? 'bg-[#0b3d91] text-white' : 'border'}`}
          onClick={() => setView(View.Progress)}
        >
          Progress
        </button>
      </div>

      {view === View.Tasks ? (
        <ul className="space-y-2">
          {tasks.map(t => (
            <li key={t.id} className="rounded border bg-white p-4">
              <div className="font-medium">{t.title}</div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{t.content || ''}</p>
            </li>
          ))}
          {tasks.length === 0 && <li className="rounded border bg-white p-4 text-sm text-gray-600">No tasks yet.</li>}
        </ul>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Student</th>
              <th className="p-2">Task</th>
              <th className="p-2">Status</th>
              <th className="p-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {progress.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              progress.map((p, i) => {
                const taskTitle = tasks.find(t => t.id === p.taskId)?.title || p.taskId
                return (
                  <tr key={`${p.studentEmail}-${p.taskId}-${i}`} className="border-t">
                    <td className="p-2">{p.studentEmail}</td>
                    <td className="p-2">{taskTitle}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2">{new Date(p.updatedAt).toLocaleString()}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      )}
    </main>
  )
}
