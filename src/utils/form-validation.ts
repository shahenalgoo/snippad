
/**
 * Check if string contains a minimum amount of characters
 * 
 * @param str 
 * @returns boolean
 */
export const containsMinChars = (str: string, min: number) => {
    return str.length < min;
}

/**
 *  Check if string contains only spaces
 * 
 * @param str 
 * @returns boolean
 */
export const containsOnlySpaces = (str: string) => {
    return str.trim().length === 0;
}


/**
 * Check if string contains special characters
 * 
 * @param str 
 * @returns boolean
 */
export const containsSpecialChars = (str: string) => {
    const specialChars = /[`@#$%^&*()\=\[\]{};:"\\|<>\/?~]/;
    return specialChars.test(str);
} 