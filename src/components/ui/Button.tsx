import React from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { overridableClasses } from '@/utils/override-classes';

const buttonVariants = cva(
    'inline-flex items-center shrink-0 font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary:
                    'bg-primary text-black hover:bg-primary-focus',
            },
            size: {
                default: 'justify-center items-center h-10 px-4 text-sm',
            },
            rounded: {
                default: 'rounded-lg',
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