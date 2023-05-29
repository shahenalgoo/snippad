/**
 * A hook to toggle between true and false
 * "false" is the default value
 * Credit: https://usehooks.com/
 */

import { useState, useCallback } from "react";

export default function useToggle(initialState: boolean = false): [boolean, any] {

    // Initialize the state
    const [state, setState] = useState<boolean>(initialState);

    // Define and memorize toggler function in case we pass down the comopnent,
    // This function change the boolean value to it's opposite value
    const toggle = useCallback((): void => setState(state => !state), []);

    return [state, toggle]
}