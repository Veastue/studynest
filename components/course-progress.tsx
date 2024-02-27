import React from 'react'
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
    value: number;
    variant?: 'default' | 'success'
    size?: 'default' | 'sm'
}

const colorByVariant = {
    default: 'text-rose-500 dark:text-white',
    success: 'text-black'
}

const sizeByVariant = {
    default: 'text-sm',
    sm: 'text-xs'
}

export const CourseProgress = ({
    value,
    variant,
    size

}: CourseProgressProps) => {
  return (
    <div>
        <Progress 
            className='h-1'
            value={value}
            variant={variant}
        />
        <p className={cn(
            'font-medium mt-2 dark:text-white',
            colorByVariant[variant || 'default'],
            sizeByVariant[size || 'default']
            )}>
        {Math.round(value)}% Complete
        </p>
    </div>
  )
}
