import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/results/judge')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/results/judge"!</div>
}
