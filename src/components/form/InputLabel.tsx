import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const inputLabelVariants = cva(
    'block mb-2 text-sm',
    {
        variants: {
            variant: {
                default: 'text-black font-medium',
                lighter: 'text-slate-300'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof inputLabelVariants> { }


const InputLabel = ({ className, children, variant, ...props }: Props) => {
    return (
        <label
            className={overridableClasses(inputLabelVariants({ className, variant }))}
            {...props}
        >
            {children}
        </label>
    )
}

export default InputLabel;