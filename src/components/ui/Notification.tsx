// React
import React from 'react';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes'

// Components
import Box from './Box';

const NotificationVariants = cva(
    'py-3 px-4',
    {
        variants: {
            variant: {
                default: 'bg-slate-100 text-black',
                danger: 'bg-rose-100 dark:bg-rose-900',
                info: 'bg-cyan-100',
                success: 'bg-green-100',
                warning: 'bg-orange-100'
            },
            font: {
                default: 'text-sm font-sans font-medium leading-4'
            }
        },
        defaultVariants: {
            variant: 'default',
            font: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof NotificationVariants> { }

export default function Notification({ className, children, variant, font, ...props }: Props) {
    return (
        <>
            <Box rounded='xl' className={overridableClasses(NotificationVariants({ className, variant, font }))} {...props}>
                {children || 'Notification text goes here...'}
            </Box>
        </>
    )
}