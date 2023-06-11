// React
import React from 'react';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const containerVariants = cva(
    'container relative ',
    {
        variants: {
            variant: {
                default: 'my-4 md:my-10'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> { }


export default function Container({ className, children, variant, ...props }: Props) {
    return (
        <div className={overridableClasses(containerVariants({ className, variant }))} {...props}>
            {children}
        </div>
    )
}
