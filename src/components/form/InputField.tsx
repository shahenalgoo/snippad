import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const inputFieldVariants = cva(
    'w-full px-6 rounded-lg outline-none border',
    {
        variants: {
            variant: {
                default: 'placeholder-neutral-500 input-color bg-input-bg border-input-border focus:border-input-border-focus',
            },
            size: {
                default: 'h-12'
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