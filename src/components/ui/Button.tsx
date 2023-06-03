import React from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { overridableClasses } from '@/utils/override-classes';

const buttonVariants = cva(
    'inline-flex justify-center items-center shrink-0 font-bold transition-colors focus:outline-none bg-white disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                hamburger: '!w-12 !h-12 bg-white !px-0 drop-shadow-lg',
                primary: 'bg-primary',
                danger: 'bg-danger',
                gray: 'bg-slate-200',
                link: 'text-slate-500 hover:bg-slate-100',
                github: 'bg-slate-800 hover:bg-slate-900 text-white font-medium',
            },
            size: {
                default: 'h-10 px-4 text-sm',
                full: 'h-12 px-4 w-full'
            },
            rounded: {
                default: 'rounded-lg'
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            rounded: 'default'
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    href?: string,
    target?: any;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, href, target, variant, size, rounded, ...props }, ref) => {
        if (href) {
            return (
                <Link
                    href={href}
                    target={target}
                    className={overridableClasses(buttonVariants({ variant, size, rounded, className }))}
                >
                    {children}
                </Link>
            )
        }
        return (
            <button
                className={overridableClasses(buttonVariants({ variant, size, rounded, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button';

export default Button;