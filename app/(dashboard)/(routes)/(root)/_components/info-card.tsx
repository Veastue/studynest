import { IconBadge } from '@/components/icon-badge'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface InfoCardProps {
    numberOfItems: number
    variant?: 'default' | 'success'
    label: string
    icon: LucideIcon
}

const InfoCard = ({
    variant,
    label,
    icon: Icon,
    numberOfItems
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge 
            variant={variant} 
            icon={Icon}        
        />
        <div>
            <p className='font-medium'>
                {label}
            </p>
            <p className='text-sm text-gray-500 dark:text-white'>
                {numberOfItems} {numberOfItems === 1? 'course': 'courses'}
            </p>
        </div>
    </div>
  )
}

export default InfoCard