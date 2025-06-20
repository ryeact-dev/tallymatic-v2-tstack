import { Input } from '@heroui/react'
import type { CriteriaItem } from '~/utils/types'

interface CriteriaProps {
  setCriteria: React.Dispatch<React.SetStateAction<Array<CriteriaItem>>>
  index: number
  criteria: CriteriaItem
}

export default function Criteria({
  setCriteria,
  index,
  criteria,
}: CriteriaProps) {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const criteriaTitle = evt.target.name
    const value = evt.target.value

    const inputValue = criteriaTitle === 'percent' ? Number(value) : value

    setCriteria((prevState: Array<CriteriaItem>) => {
      const newArray = [...prevState]
      newArray[index] = { ...newArray[index], [criteriaTitle]: inputValue }
      return newArray
    })
  }

  return (
    <div className="flex items-start space-x-4 my-2 px-2">
      <div className="flex-1">
        <Input
          name="criteriaTitle"
          label="Title"
          labelPlacement="outside"
          placeholder="Enter criteria title"
          onChange={(evt) => handleChange(evt)}
          value={criteria.criteriaTitle}
          //   className='border-[2px] border-primary/50 shadow-lg'
        />
      </div>
      <div className="w-[20%]">
        <Input
          name="percent"
          type="number"
          label="Percent"
          labelPlacement="outside"
          placeholder="%"
          onChange={(evt) => handleChange(evt)}
          value={criteria.percent === 0 ? '' : String(criteria.percent)}
          //   className='border-[2px] border-primary/50 shadow-lg'
        />
      </div>
    </div>
  )
}
