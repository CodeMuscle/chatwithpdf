import { SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './button'
import { FilePlus2 } from 'lucide-react'

const Header = () => {
  return (
    <div className="flex justify-between shadow-sm bg-white p-5 border-b">
      <Link href={'/dashboard'} className="text-2xl">
        PDF<span className="text-indigo-600">Nugget</span>
      </Link>

      <SignedIn>
        <div className="flex tems-center space-x-2">
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-indigo-600">
            <Link href="/dashboard/upload">
              <FilePlus2 className="text-indigo-600" />
            </Link>
          </Button>

          {/* Upgrade Button */}
          <UserButton />
        </div>
      </SignedIn>
    </div>
  )
}

export default Header
