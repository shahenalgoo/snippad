/**
 * This hook allows the user to save changes with CTRL+S
 * It also saves automatically if the user exits the note but stays on the app
 */

import { useCallback, useEffect } from "react";

export default function useCTRLS(saveNote: (manualSave?: boolean) => Promise<string | null | undefined>) {

    //Keyboard event
    //
    const handleKeyDown = useCallback((e: any) => {
        // Save Note - Ctrl + s
        if ((e.ctrlKey && e.key === "S" || e.ctrlKey && e.key === "s")) {
            e.preventDefault();
            saveNote(true);
        }
    }, []);

    useEffect(() => {

        // Register keydown events
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // De-register keydown events
            window.removeEventListener("keydown", handleKeyDown);

            // Save note when leaving (unmounts)
            saveNote();
        };
    }, [handleKeyDown])
}