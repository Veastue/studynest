'use client'

import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { Ghost, LogOut } from 'lucide-react'
import Link from 'next/link'
import { DarkModeToggle } from './dark-mode-toggle'
import { SearchInput } from './search-input'

const NavbarRoutes = () => {

  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search'

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto items-center'>
      {isTeacherPage || isCoursePage ? (
        <Link href={'/'}>
          <Button size='sm' variant='ghost'>
          <LogOut  className='h-4 w-4 mr-2'/>
          Exit
        </Button>
        </Link>
      ): (
        <Link href='/teacher/courses'>
          <Button size='sm' variant='ghost'>
            Teacher Mode
          </Button>
        </Link>
      )}
        <UserButton
          afterSignOutUrl='/'
        />
        <DarkModeToggle />
    </div>
    </>
  )
}

export default NavbarRoutes