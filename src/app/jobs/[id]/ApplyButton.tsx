'use client'

import { useState } from 'react'
import ApplyModal from '@/components/ApplyModal'
import { Job } from '@/lib/types'

interface Props {
  job: Job
}

export default function ApplyButton({ job }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <ApplyModal job={job} onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full bg-violet-600 text-white font-bold py-4 rounded-full text-base hover:bg-violet-700 active:bg-violet-600 transition"
      >
        Apply now
      </button>
    </>
  )
}
