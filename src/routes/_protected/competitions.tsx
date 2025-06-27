import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import type { SingleCandidateWithScoresheet } from '~/utils/types'

import CandidatesCards from '~/components/competitions/candidates-cards/CandidatesCards'
import { candidateQueries } from '~/hooks/candidate.hook'
import { openModal } from '~/store'
import { competitionSearchSchema } from '~/zod/search.schema'

export const Route = createFileRoute('/_protected/competitions')({
  validateSearch: (search) => competitionSearchSchema.parse(search),
  loaderDeps: ({ search: { filter } }) => ({ filter }),
  loader: async ({ context, deps: { filter } }) => {
    const selectedCompetition = context.competitionLinks.find(
      (competition) => competition.id === filter,
    )

    await context.queryClient.ensureQueryData(
      candidateQueries.list({
        page: 1,
        limit: 30,
        filter: '',
        eventId: context.user?.event?.id || '',
        competitionId: filter,
      }),
    )

    if (!selectedCompetition) {
      throw redirect({ to: '..' })
    }

    return { activeCompetition: selectedCompetition }
  },
  head: () => ({
    meta: [{ title: 'Tallymatic | Competitions' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { activeCompetition } = Route.useLoaderData()

  const { data: candidates } = useSuspenseQuery(
    candidateQueries.list({
      page: 1,
      limit: 30,
      filter: '',
      eventId: user.event?.id,
      competitionId: activeCompetition?.id ?? '',
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
        <h2 className="text-3xl font-bold text-primary-600">
          {activeCompetition?.name}
        </h2>
        <h4 className="text-base font-semibold text-gray-700">
          {activeCompetition?.isFinalist
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
