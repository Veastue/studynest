"use client"

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    href: string
}

const SidebarItem = ({
    icon: Icon,
    label,
    href
}: SidebarItemProps) => {

    //hooks
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
    (pathname === '/' && href === '/') || 
    pathname === href ||
    pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href)
    }

  return (
    <button 
        onClick={onClick}
        type="button"
        className={cn(
            'flex items-center gap-x-2 dark:text-white text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
            isActive && 'text-rose-700 dark:text-white bg-sky-200/20 hover:bg-sky-200/20 hover:text-rose-700'
        )}
    >
        <div className="flex items-center gap-x-2 py-4">
            <Icon 
                size={22}
                className={cn(
                    'text-slate-500 dark:text-white',
                    isActive && 'text-rose-700 dark:text-white'
                )}
            />
            {label}
        </div>
        <div className={cn(
            'ml-auto opacity-0 border-2 border-rose-700 h-full transition-all',
            isActive && 'opacity-100'
        )}></div>
    </button>
  )
}

export default SidebarItem