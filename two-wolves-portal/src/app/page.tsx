
export default function Home() {
  return (
    <main className="space-y-4">
      <h2 className="text-lg font-semibold">Welcome</h2>
      <p>Students: click <a className="underline" href="/student">Student</a>. Teachers: <a className="underline" href="/teacher">Teacher</a>.</p>
      <p className="text-sm text-gray-600">Use your school email to sign in.</p>
    </main>
  )
}
