'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, listPublishedTasks, PortalTask } from '../../lib/portal-data'

export default function StudentHome() {
  const [tasks, setTasks] = useState<PortalTask[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (user.role === 'teacher') {
      window.location.href = '/teacher'
      return
    }
    setTasks(listPublishedTasks())
  }, [])

  return (
    <main className="space-y-4">
      <h2 className="text-lg font-semibold">Today’s tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks published yet. Check back soon!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(t => (
            <li key={t.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{t.content || ''}</p>
                </div>
                <a className="rounded bg-[#0b3d91] px-3 py-1 text-white" href={`/task/${t.id}`}>
                  Start
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
