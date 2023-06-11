// React
import React, { FC } from 'react';

//
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const dropdownVariants = cva(
    'hidden absolute top-0 z-[9999] max-w-[14rem] ',
    {
        variants: {
            variant: {
                default: 'left-0',
                right: 'right-0'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof dropdownVariants> { }


export default function Dropdown({ className, children, variant, ...props }: Props) {
    return (
        <div className={overridableClasses(dropdownVariants({ className, variant }))} {...props}>
            <div className='p-1 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-lg'>
                {children}
            </div>
        </div>
    )
}

/**
 * DROPDOWN ITEM
 * 
 */
interface DropdownItemProps {
    children: React.ReactNode;
}

export const DropdownItem: FC<DropdownItemProps> = ({ children }) => {
    return (
        <div className="hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-md text-sm font-semibold transition-all">
            {children}
        </div>
    );
}