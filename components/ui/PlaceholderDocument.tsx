'use client'

import { useRouter } from 'next/navigation'
import { Button } from './button'
import { PlusCircleIcon } from 'lucide-react'

const PlaceholderDocument = () => {
  const router = useRouter();

  const handleClick = () => {
    
    // Check if the user is the FREE tier! If not, push to the upgrade page.

    router.push('/dashboard/upload')
  }
  return (
    <Button onClick={handleClick} className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400">
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  )
}

export default PlaceholderDocument