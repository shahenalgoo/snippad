import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';
import { TbChevronDown } from 'react-icons/tb';

const SelectVariants = cva(
    'block w-full px-4 text-sm font-sans rounded-lg outline-none appearance-none cursor-pointer disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                default: 'bg-transparent border border-border-light focus:border-neutral-500 text-gray-900',
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
    extends React.HTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof SelectVariants> { }


const Select = ({ className, children, variant, size, ...props }: Props) => {
    return (
        <div className="relative">
            <select
                className={overridableClasses(SelectVariants({ className, variant, size }))}
                {...props}
            >
                {children}
            </select>
            <TbChevronDown size={18} className="z-[-1] absolute top-0 right-0 m-[12px] opacity-30" />
        </div>
    )
}

export default Select;