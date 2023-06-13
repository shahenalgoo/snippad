/**
 * This hook prompts the user with a warning about unsaved changes
 * 
 */

// React
import { useEffect } from "react";

export default function useUnsavedChangesWarning(condition: boolean) {

    useEffect(() => {

        // beforeUnloadHandler executes when unload events happen
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            // The prompt will only appear only if the condition is true. 
            if (condition) {
                e.preventDefault();
                e.returnValue = true;
            }
        }

        //Add listener to track window events
        window.addEventListener("beforeunload", beforeUnloadHandler);

        //Remove listener on unmount
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);

        }
    }, [condition]);
}