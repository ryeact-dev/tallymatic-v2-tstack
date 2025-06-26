import { useState } from 'react'
import ScoresheetForm from './ScoresheetForm'

import type { CriteriaItem, SingleCandidateWithScoresheet } from '~/utils/types'
import ScoresheetPhoto from './ScoresheetPhoto'

export default function CandidateScoreSheetModal({
  data,
  onClose,
}: {
  data: SingleCandidateWithScoresheet
  onClose: () => void
}) {
  const { candidate, competition, candidateScoresheet, userId } = data

  const [scoresheet, setScoresheet] = useState<Array<CriteriaItem>>(
    candidateScoresheet
      ? (candidateScoresheet.scores as unknown as Array<CriteriaItem>)
      : competition.criteria,
  )

  const [totalScore, setTotalScore] = useState(
    candidateScoresheet ? Number(candidateScoresheet.total) : 0,
  )

  const calculateTotal = (scores: Array<CriteriaItem>) => {
    const candidateScore = scores.reduce(
      (total, score) => total + (Number(score.score) || 0),
      0,
    )
    return Number(candidateScore.toFixed(1))
  }

  const handleRangeChange = (value: number, index: number) => {
    setScoresheet((prevState) => {
      const newArray = [...prevState]
      const newScore = Math.min(
        value || 0,
        Number(newArray[index]?.percent) || 0,
      )
      newArray[index] = { ...newArray[index], score: newScore }
      const newTotal = calculateTotal(newArray)
      setTotalScore(newTotal)
      return newArray
    })
  }

  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = evt.target.value

    setScoresheet((prevState) => {
      const newArray = [...prevState]
      const newScore = Math.min(
        Number(value) || 0,
        Number(newArray[index].percent) || 0,
      )
      newArray[index] = { ...newArray[index], score: newScore }
      const newTotal = calculateTotal(newArray)
      setTotalScore(newTotal)
      return newArray
    })
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    let scoresheetObj = {
      scores: scoresheet,
      userId,
      candidateId: candidate.id,
      competitionId: competition.id,
      total: Number(totalScore),
    }

    // if (candidateScoresheet) {
    //   scoresheetObj = { ...scoresheetObj, id: candidateScoresheet.id };
    //   addCandidateScoreMutation({ scoresheetObj, isNew: false });
    // } else {
    //   addCandidateScoreMutation({ scoresheetObj, isNew: true });
    // }
  }

  return (
    <form className="flex gap-6 p-6 -mt-6" onSubmit={handleSubmit}>
      <ScoresheetPhoto candidate={candidate} totalScore={totalScore} />
      <ScoresheetForm
        closeModal={onClose}
        scoresheet={scoresheet}
        handleRangeChange={handleRangeChange}
        handleInputChange={handleInputChange}
        loadingMutation={false}
      />
    </form>
  )
}
