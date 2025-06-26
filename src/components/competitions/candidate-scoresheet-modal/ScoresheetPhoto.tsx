import { ImageIcon } from 'lucide-react'
import type { Candidate } from '~/generated/prisma/client'

interface ScoresheetPhotoProps {
  candidate: Candidate
  totalScore: number
}

export default function ScoresheetPhoto({
  candidate,
  totalScore,
}: ScoresheetPhotoProps) {
  return (
    <div className="relative size-auto max-h-80 w-[35%] items-center rounded-2xl shadow-lg">
      <div className="absolute bottom-1 right-1 flex w-28 items-center justify-center rounded-md border-2 border-accent bg-accent/90 p-1 backdrop-blur-xl">
        <p className="text-3xl font-semibold text-white">
          {totalScore === 0 ? '0' : totalScore}
        </p>
      </div>
      {candidate.photo ? (
        <div className="w-full rounded-lg h-80 overflow-hidden">
          <img
            src={candidate.photo}
            className={' h-full w-full object-cover object-center '}
          />
        </div>
      ) : (
        <div className="flex h-80 w-full items-center justify-center">
          <div className="w-full h-full flex items-center justify-center gap-2">
            <ImageIcon size={36} className="text-secondary" />
          </div>
        </div>
      )}
    </div>
  )
}
