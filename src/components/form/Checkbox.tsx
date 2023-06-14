// React
import React from 'react';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';
import { TbCheck } from 'react-icons/tb';

const checkboxVariants = cva(
    'checkmark bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all overflow-hidden',
    {
        variants: {
            variant: {
                default: 'rounded-full',
                circle: 'rounded-full'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface Props
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> { }


const Checkbox = ({ children, ...props }: Props) => {
    return (
        <label className="checkbox ">
            {children}
            <input type="checkbox" {...props} />
            <Checkmark />
        </label>
    )
}

const Checkmark = ({ className, variant }: Props) => {
    return (
        <span className={overridableClasses(checkboxVariants({ className, variant }))}>
            <TbCheck className='checkmark-icon hidden w-full h-full p-1' />
        </span>
    )
}

export default Checkbox;