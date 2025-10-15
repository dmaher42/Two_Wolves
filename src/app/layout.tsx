
import './globals.css'
import './codex-overrides.css'

export const metadata = { title: process.env.NEXT_PUBLIC_SITE_NAME || 'Class Portal' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{process.env.NEXT_PUBLIC_SITE_NAME || 'Class Portal'}</h1>
            <nav className="space-x-4 text-sm">
              <a className="underline" href="/">Home</a>
              <a className="underline" href="/student">Student</a>
              <a className="underline" href="/teacher">Teacher</a>
              <a className="underline" href="/login">Log in</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
