import React from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { overridableClasses } from '@/utils/override-classes';

const buttonVariants = cva(
    'relative inline-flex justify-center items-center shrink-0 font-sans font-semibold transition-all outline-none focus:outline-none bg-white disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary',
                danger: 'bg-danger',

                gray: 'bg-neutral-100 hover:bg-neutral-200',
                black: 'bg-black hover:bg-neutral-950 text-white',

                border: 'border border-border-light',
                link: 'bg-transparent hover:bg-neutral-100 text-slate-500',

                github: 'bg-slate-800 hover:bg-slate-900 text-white font-medium',
                hamburger: '!w-12 !h-12 bg-white !px-0 drop-shadow-lg',
                bubble: '!w-12 !h-12 !px-0 !text-lg bg-transparent',
            },
            size: {
                default: 'h-10 px-4 text-sm',
                full: 'h-12 px-4 w-full',
                square: 'w-10 h-10 p-0'
            },
            rounded: {
                default: 'rounded-lg',
                full: 'rounded-full'
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