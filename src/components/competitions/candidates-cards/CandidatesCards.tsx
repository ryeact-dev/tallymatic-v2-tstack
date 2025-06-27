import { Badge, Card, CardBody } from '@heroui/react'
import { motion } from 'framer-motion'

import type { Scoresheet } from '~/generated/prisma/client'
import type {
  CandidatesWithScoresheet,
  CurrentUser,
  SingleCandidateWithScoresheet,
  UserCompetition,
} from '~/utils/types'

interface CandidatesCardsProps {
  candidates: Array<CandidatesWithScoresheet>
  competition: UserCompetition
  user: CurrentUser
  onAddScoreHandler: (data: SingleCandidateWithScoresheet) => void
}

const competitionScoresheet = (
  competitionId: string,
  candidateScoresheets: Array<Scoresheet> | [],
) => {
  if (!competitionId) return { candidateScoresheet: null, totalScore: 0 }

  const candidateScoresheet =
    candidateScoresheets.find(
      (scoresheet) => scoresheet.competitionId === competitionId,
    ) || null

  const totalScore = candidateScoresheet?.total || 0

  return { candidateScoresheet, totalScore }
}

export default function CandidatesCards({
  candidates,
  competition,
  user,
  onAddScoreHandler,
}: CandidatesCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {candidates.map((candidate, index) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          key={`${competition.id}-${index}`}
        >
          <Card
            className="sm:h-[24rem] sm:w-[18rem] group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg overflow-hidden"
            // onClick={() => handleCandidateClick(candidate)}
          >
            <CardBody className="p-0 relative overflow-hidden ">
              <figure
                className={`transition-scale absolute left-0 top-0 h-[24rem] w-full duration-300 ease-in hover:scale-110 ${
                  user.role === 'judge' && 'hover:cursor-pointer'
                }`}
                onClick={() =>
                  // currentUser.role === 'judge' &&
                  onAddScoreHandler({
                    candidate,
                    competition,
                    candidateScoresheet: competitionScoresheet(
                      competition.id || '',
                      candidate.scoresheet,
                    ).candidateScoresheet,
                    userId: user.id,
                  })
                }
              >
                {/* <div className="absolute bottom-0 left-0 h-[10rem] w-full bg-gradient-to-t from-red-700 to-bg-secondary/10 z-10" /> */}

                <img
                  src={candidate.photo || ''}
                  className="w-full h-full object-cover object-center"
                  alt={candidate.fullName}
                  // loading="lazy"
                />
                {/* </div> */}
              </figure>

              <div
                className={`absolute bottom-0 z-20 flex w-full justify-center gap-2 py-2.5`}
                // onClick={() =>
                //   addScoreButton(
                //     candidate,
                //     competition,
                //     isTheCandidate(candidate.candidate_number)
                //   )
                // }
              >
                <div className="flex size-12 items-center justify-center rounded-md border-2 border-secondary bg-secondary/90 p-1 backdrop-blur-sm">
                  <p className=" text-2xl font-semibold text-white">
                    {candidate.number < 10 && '0'}
                    {candidate.number}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-[60%] items-center justify-center rounded-md border-2 backdrop-blur-sm ${
                    Number(
                      competitionScoresheet(
                        competition.id || '',
                        candidate.scoresheet,
                      ).totalScore,
                    ) > 0
                      ? 'border-secondary bg-secondary/75'
                      : 'border-primary bg-primary/80'
                  }`}
                >
                  <p className="-mt-1 font-[Inconsolata] text-3xl font-semibold uppercase text-white">
                    {`${
                      competitionScoresheet(
                        competition.id || '',
                        candidate.scoresheet,
                      ).totalScore
                    } pts `}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
