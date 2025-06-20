import { Button } from '@heroui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
      <p className="text-muted-foreground mb-4">
        You are not authorized to view this content.
      </p>
      <Button onPress={() => navigate({ to: '/' })}>Go to Home</Button>
    </div>
  )
}
