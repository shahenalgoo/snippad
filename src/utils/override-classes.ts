/**
 * Make classes overridable
 * Example: use to overwrite classes of the Button component.
 * 
 */

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function overridableClasses(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}