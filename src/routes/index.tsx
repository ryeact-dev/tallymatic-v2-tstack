import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const user = context.user

    if (!user) {
      return redirect({ to: '/login' })
    }

    return { user }
  },
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Dashboard</h3>
    </div>
  )
}
