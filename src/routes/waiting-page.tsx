import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/waiting-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/waiting-page"!</div>
}
