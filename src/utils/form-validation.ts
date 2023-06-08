

/**
 *  Check if string contains only spaces
 * 
 * @param string 
 * @returns boolean
 */
export const containsOnlySpaces = (string: string) => {
    return string.trim().length === 0;
}


/**
 * Check if string contains special characters
 * 
 * @param string 
 * @returns boolean
 */
export const containsSpecialChars = (string: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(string);
} 