import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitions')({
  validateSearch: (search: Record<string, unknown>): { filter: string } => {
    return { filter: search.filter as string }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/competitions"!</div>
}
