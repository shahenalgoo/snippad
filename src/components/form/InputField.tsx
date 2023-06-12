// React
import React from 'react';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const inputFieldVariants = cva(
    'w-full px-4 rounded-lg outline-none border',
    {
        variants: {
            variant: {
                default: 'placeholder-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600',
            },
            size: {
                default: 'h-10'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof inputFieldVariants> {
    disabled?: any;
    type?: any;
    value?: any;
    minLength?: any;
    maxLength?: any;
}


const InputField = ({ className, disabled, type, value, minLength, maxLength, variant, size, ...props }: Props) => {
    return (
        <input
            className={overridableClasses(inputFieldVariants({ className, variant, size }))}
            {...props}
            type={type || 'text'}
            disabled={disabled}
            value={value}
            minLength={minLength}
            maxLength={maxLength}
        />
    )
}

export default InputField;