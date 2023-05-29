import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const boxVariants = cva(
    'relative',
    {
        variants: {
            variant: {
                solid: 'bg-zinc-100'
            },
            rounded: {
                default: 'rounded-xl'
            },
            space: {
                default: 'p-4 sm:p-6'
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