import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import AddEventSheetBody from './settings/events/add-event/AddEventSheetBody'
import AddEventManagerSheetBody from './settings/users/add-event-manager/AddEventManagerSheetBody'
import AddJudgesTabulatorsSheetBody from './settings/users/add-judges-tabulators/AddJudgesTabulatorsSheetBody'
import AddCompetitionSheetBody from './settings/competitions/add-competition/AddCompetitionSheetBody'
import AddCandidateSheetBody from './settings/candidate/add-candidate/AddCandidateSheetBody'

import type {
  CandidateNoCreatedAt,
  UserCompetition,
  UserWithEventAndCompetitions,
} from '~/utils/types'
import type { Event } from '~/generated/prisma/client'

import { closeSheet, sheetStore } from '~/store'

export default function SheetContainer() {
  const { isSheetOpen, size, data, title } = useStore(sheetStore)

  let body = <div />

  switch (data.type) {
    case 'event':
      body = (
        <AddEventSheetBody
          eventInfo={data.data as Event}
          onClose={closeSheet}
        />
      )
      break

    case 'manager':
      body = (
        <AddEventManagerSheetBody
          userInfo={data.data as UserWithEventAndCompetitions}
          onClose={closeSheet}
        />
      )
      break

    case 'user':
      body = (
        <AddJudgesTabulatorsSheetBody
          userInfo={data.data as UserWithEventAndCompetitions}
          onClose={closeSheet}
        />
      )
      break

    case 'competition':
      body = (
        <AddCompetitionSheetBody
          compInfo={data.data as UserCompetition}
          onClose={closeSheet}
        />
      )
      break

    case 'candidate':
      body = (
        <AddCandidateSheetBody
          candidateInfo={data.data as CandidateNoCreatedAt}
          onClose={closeSheet}
        />
      )
      break

    default:
      body
  }

  return (
    <Drawer
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isSheetOpen}
      size={size}
      onClose={closeSheet}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>
        <DrawerBody>{body}</DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
