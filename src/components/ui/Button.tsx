// React
import React from 'react';
import Link from 'next/link';

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';

const buttonVariants = cva(
    'relative inline-flex justify-center items-center shrink-0 font-sans font-semibold transition-all outline-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-black',
                danger: 'bg-danger text-black',

                gray: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700',
                black: 'bg-black hover:bg-neutral-950 text-white',

                border: 'dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-border-light dark:border-border-dark ',
                link: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400',

                hamburger: '!w-12 !h-12 bg-white !px-0 drop-shadow-lg',
                inverted: '!w-11 !h-11 !p-0 bg-transparent text-black dark:text-white',
                github: 'bg-slate-800 hover:bg-slate-700 text-white font-medium'
            },
            size: {
                default: 'h-10 px-4 text-sm',
                full: 'h-12 px-4 w-full',
                square: 'w-10 h-10 p-0',
                small: 'h-8 px-2 text-sm'
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