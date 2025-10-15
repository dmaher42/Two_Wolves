export type PortalRole = 'student' | 'teacher'

export type PortalUser = {
  email: string
  role: PortalRole
}

export type PortalTask = {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
}

export type PortalSubmission = {
  taskId: string
  studentEmail: string
  content: string
  status: 'draft' | 'submitted'
  updatedAt: string
}

const USER_KEY = 'two-wolves:user'
const TASKS_KEY = 'two-wolves:tasks'
const SUBMISSIONS_KEY = 'two-wolves:submissions'

const DEFAULT_TASKS: PortalTask[] = [
  {
    id: 'welcome-essay',
    title: 'TEEL Paragraph – The Two Wolves Story',
    content:
      'Write a TEEL paragraph explaining the moral of the Two Wolves story.\n\nT – Topic sentence\nE – Evidence (use a quote)\nE – Explain the evidence\nL – Link back to the prompt',
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reflection',
    title: 'Reflection Journal',
    content:
      'Reflect on a time you faced a difficult choice. Which “wolf” did you feed and why? Aim for 200–250 words.',
    published: true,
    createdAt: new Date().toISOString(),
  },
]

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn('Failed to read from storage', error)
    return fallback
  }
}

function writeToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to write to storage', error)
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `task-${Math.random().toString(36).slice(2, 10)}`
}

export function getCurrentUser(): PortalUser | null {
  return readFromStorage<PortalUser | null>(USER_KEY, null)
}

export function setCurrentUser(user: PortalUser) {
  writeToStorage(USER_KEY, user)
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(USER_KEY)
}

export function listTasks(): PortalTask[] {
  const tasks = readFromStorage<PortalTask[]>(TASKS_KEY, DEFAULT_TASKS)
  return tasks.length ? tasks : DEFAULT_TASKS
}

export function findTask(id: string): PortalTask | undefined {
  return listTasks().find(task => task.id === id)
}

export function listPublishedTasks(): PortalTask[] {
  return listTasks().filter(task => task.published !== false)
}

export function createTask(title: string, content: string): PortalTask {
  const tasks = listTasks()
  const task: PortalTask = {
    id: generateId(),
    title,
    content,
    published: true,
    createdAt: new Date().toISOString(),
  }
  writeToStorage(TASKS_KEY, [...tasks, task])
  return task
}

function readSubmissions(): PortalSubmission[] {
  return readFromStorage<PortalSubmission[]>(SUBMISSIONS_KEY, [])
}

export function listSubmissions(): PortalSubmission[] {
  const submissions = readSubmissions()
  return [...submissions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

function saveSubmissions(submissions: PortalSubmission[]) {
  writeToStorage(SUBMISSIONS_KEY, submissions)
}

export function ensureSubmission(taskId: string, studentEmail: string): PortalSubmission {
  const submissions = readSubmissions()
  const existing = submissions.find(
    submission => submission.taskId === taskId && submission.studentEmail === studentEmail,
  )
  if (existing) return existing
  const submission: PortalSubmission = {
    taskId,
    studentEmail,
    content: '',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  }
  saveSubmissions([...submissions, submission])
  return submission
}

export function updateSubmission(
  taskId: string,
  studentEmail: string,
  updates: Partial<Pick<PortalSubmission, 'content' | 'status'>>,
) {
  const submissions = readSubmissions()
  const index = submissions.findIndex(
    submission => submission.taskId === taskId && submission.studentEmail === studentEmail,
  )
  const next: PortalSubmission = {
    taskId,
    studentEmail,
    content: updates.content ?? submissions[index]?.content ?? '',
    status: updates.status ?? submissions[index]?.status ?? 'draft',
    updatedAt: new Date().toISOString(),
  }
  if (index >= 0) {
    submissions[index] = next
  } else {
    submissions.push(next)
  }
  saveSubmissions(submissions)
  return next
}
