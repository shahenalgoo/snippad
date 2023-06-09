import React, { FC } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const dropdownVariants = cva(
    'hidden absolute top-full max-w-[14rem] mt-2 p-1 rounded-lg bg-white border border-neutral-200 shadow-lg',
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
            {children}
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
        <div className="hover:bg-neutral-100 rounded-md text-sm font-semibold transition-all">
            {children}
        </div>
    );
}