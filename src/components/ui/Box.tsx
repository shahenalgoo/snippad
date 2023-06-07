import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const boxVariants = cva(
    'shrink-0 relative',
    {
        variants: {
            variant: {
                solid: 'bg-slate-100',
                border: 'border border-border-light',
                transparent: ''
            },
            rounded: {
                default: 'rounded-lg',
                xl: 'rounded-xl'
            },
            space: {
                default: 'p-4',
            }
        },
        defaultVariants: {
            variant: 'solid',
            rounded: 'default',
            space: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof boxVariants> { }


const Box = ({ className, children, variant, rounded, space, ...props }: Props) => {
    return (
        <div className={overridableClasses(boxVariants({ className, variant, rounded, space }))} {...props}>
            {children}
        </div>
    )
}

export default Box;