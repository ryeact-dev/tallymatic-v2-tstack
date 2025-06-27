import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import type {
  CandidatesWithScoresheet,
  SingleCandidateWithScoresheet,
} from '~/utils/types'

import { candidateQueries } from '~/hooks/candidate.hook'
import { competitionQueries } from '~/hooks/competition.hook'
import { competitionSearchSchema } from '~/zod/search.schema'
import CandidatesCards from '~/components/competitions/candidates-cards/CandidatesCards'
import { openModal } from '~/store'

export const Route = createFileRoute('/competitions')({
  validateSearch: (search) => competitionSearchSchema.parse(search),
  beforeLoad: ({ context }) => {
    const { user } = context

    if (!user) {
      throw redirect({ to: '/login', replace: true })
    }

    return { user }
  },
  loaderDeps: ({ search: { filter } }) => ({ filter }),
  loader: async ({ context, deps: { filter } }) => {
    let candidates: Array<CandidatesWithScoresheet> = []

    const activeCompetitionPromise = context.queryClient.ensureQueryData(
      competitionQueries.single(filter),
    )

    const candidatesPromise = context.queryClient.ensureQueryData(
      candidateQueries.list({
        page: 1,
        limit: 30,
        filter: '',
        eventId: context.user.event?.id || '',
        competitionId: filter,
      }),
    )

    const [activeCompetition, candidateList] = await Promise.all([
      activeCompetitionPromise,
      candidatesPromise,
    ])

    candidates = candidateList

    if (!activeCompetition.isActive && context.user.role === 'judge') {
      throw redirect({ to: '/waiting-page', replace: true })
    }

    return { activeCompetition }
  },
  head: () => ({
    meta: [{ title: 'Tallymatic | Competitions' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { filter } = Route.useSearch()
  const { user } = Route.useRouteContext()
  const { activeCompetition } = Route.useLoaderData()

  const { data: candidates } = useSuspenseQuery(
    candidateQueries.list({
      page: 1,
      limit: 30,
      filter: '',
      eventId: activeCompetition.eventId || '',
      competitionId: activeCompetition.id || '',
    }),
  )

  const onAddScoreHandler = (data: SingleCandidateWithScoresheet) => {
    if (!data.candidate.id) return

    openModal({
      data: {
        type: 'scoresheet',
        data,
      },
      isModalOpen: true,
      size: '3xl',
      title: (
        <p className="text-2xl font-bold">
          Scoresheet - Candidate No.: {data.candidate.number}
        </p>
      ),
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-700">
          {activeCompetition.name}
        </h2>
        <h4 className="text-base font-semibold text-gray-700">
          {activeCompetition.isFinalist
            ? 'Major Competition'
            : 'Minor Competition'}
        </h4>
      </div>

      {candidates.length === 0 ? (
        <>No candidates found</>
      ) : (
        <CandidatesCards
          candidates={candidates}
          competition={activeCompetition}
          user={user}
          onAddScoreHandler={onAddScoreHandler}
        />
      )}
    </div>
  )
}
