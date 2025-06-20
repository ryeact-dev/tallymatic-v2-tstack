import { Button } from '@heroui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'

export const Route = createFileRoute('/unauthenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <LogIn className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
      <p className="text-muted-foreground mb-4">
        You must be logged in to view this content. Please sign in to continue.
      </p>
      <Button type="button" onPress={() => navigate({ to: '/login' })}>
        Sign in
      </Button>
    </div>
  )
}
