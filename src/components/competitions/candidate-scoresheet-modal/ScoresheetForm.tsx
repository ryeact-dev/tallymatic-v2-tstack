import { Button, Input, Slider } from '@heroui/react'
import React from 'react'
import type { CriteriaItem } from '~/utils/types'
import ModalButtons from '~/components/ModalButtons'

interface ScoresheetFormProps {
  closeModal: () => void
  scoresheet: Array<CriteriaItem>
  handleRangeChange: (value: number, index: number) => void
  handleInputChange: (
    evt: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void
  isLoading: boolean
}

export default function ScoresheetForm({
  closeModal,
  scoresheet,
  handleRangeChange,
  handleInputChange,
  isLoading,
}: ScoresheetFormProps) {
  return (
    <div className="flex flex-[2] flex-col items-end justify-between">
      <div className="w-full space-y-2">
        {scoresheet.map((criteria, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="mb-2 flex w-full items-center justify-between gap-4">
              <Slider
                color="secondary"
                value={criteria.score || 0}
                maxValue={criteria.percent}
                minValue={0}
                label={`${criteria.criteriaTitle} - ${criteria.percent}%`}
                step={0.1}
                hideValue
                // onValueChange={(values) => handleRangeChange(values, index)}
                // change the styles (handle colors and background)
                // change it directly to Slider component
                classNames={{
                  base: 'hover:cursor-pointer',
                  label: 'text-lg font-semibold',
                }}
                onChange={(values) =>
                  handleRangeChange(values as number, index)
                }
              />
              <Input
                classNames={{
                  base: 'w-32 border-gray-300 p-2',
                  input: 'text-xl font-bold',
                }}
                type="number"
                value={String(criteria.score || 0)}
                max={criteria.percent}
                min={0}
                step={0.1}
                onChange={(evt) => handleInputChange(evt, index)}
                size="lg"
              />
            </div>
          </div>
        ))}
      </div>
      <ModalButtons isLoading={isLoading} onClose={closeModal} />
    </div>
  )
}
