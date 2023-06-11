// React
import React from 'react';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const titleVariants = cva(
    'mb-6 md:mb-10 font-bold',
    {
        variants: {
            variant: {
                h1: 'text-2xl md:text-2xl',
            },
            align: {
                left: 'text-left',
                center: 'text-center'
            }
        },
        defaultVariants: {
            variant: 'h1',
            align: 'left'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof titleVariants> {

    type: string;
}


export default function Title({ className, children, variant, align, type, ...props }: Props) {
    return (
        <>
            {type === "h1" &&
                <h1 className={overridableClasses(titleVariants({ className, variant, align }))} {...props}>
                    {children}
                </h1>
            }
        </>
    )
}