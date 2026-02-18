'use client'

import { Button } from '@/shared/Button'
import ButtonCircle from '@/shared/ButtonCircle'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'

const SearchModalContent = dynamic(() => import('./SearchModalContent'), {
  ssr: false,
})

interface Props {
  type: 'type1' | 'type2'
}

const SearchModal: FC<Props> = ({ type = 'type1' }) => {
  const [open, setOpen] = useState(false)

  const buttonOpenModal2 = () => {
    return (
      <>
        <div className="hidden md:block">
          <Button outline aria-label="Search" title="Search" className="w-full justify-between px-4!" onClick={() => setOpen(true)}>
            <span className="text-sm/6 font-normal text-neutral-500 dark:text-neutral-400">Type to search...</span>
            <HugeiconsIcon icon={Search01Icon} size={24} className="ms-auto" />
          </Button>
        </div>

        <div className="-ms-1 md:hidden">
          <ButtonCircle plain aria-label="Search" title="Search" onClick={() => setOpen(true)}>
            <HugeiconsIcon icon={Search01Icon} size={24} />
          </ButtonCircle>
        </div>
      </>
    )
  }

  const buttonOpenModal1 = () => {
    return (
      <ButtonCircle plain aria-label="Search" title="Search" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Search01Icon} size={24} />
      </ButtonCircle>
    )
  }

  return (
    <>
      <>{type === 'type1' ? buttonOpenModal1() : buttonOpenModal2()}</>
      {open && <SearchModalContent open={open} onClose={() => setOpen(false)} />}
    </>
  )
}

export default SearchModal
