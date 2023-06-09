/**
 * This script auto-creates a few new notes as tutorials for new users
 */

import { useUser } from "@/context/SessionContext";
import { tutorialNotes } from "@/data/tutorialNotes";
import { useState } from "react";
import useDocumentCreate from "./appwrite/database/useDocumentCreate";
import { AppwriteIds } from "@/lib/appwrite-config";
import { NoteStatus, NoteType } from "@/types/enums";
import { Note } from "@/types/typings";

/**
 * 
 * @param notebook_id id of parent notebook of the notes
 * @returns createExamples function
 * @returns isLoading state
 * 
 */

export default function useNoteExamples() {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { createDocument: createNote } = useDocumentCreate(AppwriteIds.collectionId_notes);

    const createNoteExamples = async (notebook_id: string) => {
        setIsLoading(true);
        let welcomeNoteId: string = "";

        // Looping through and creating the notes
        // Reverse looping so first note appears on top in the sidebar
        //
        for (let i = tutorialNotes.length - 1; i >= 0; i--) {
            const noteData = tutorialNotes[i];

            const note = await createNote({
                data: {
                    title: noteData.title,
                    subtitle: noteData.subtitle,
                    body: noteData.body,
                    notebook_related: notebook_id,
                    type: noteData.type,
                    starred: false,
                    status: NoteStatus.published,
                    status_last_update: new Date(),
                    snippet_language: noteData.snippet_language,
                    search_index: ''
                } as Note,
            })

            if (i == 0) welcomeNoteId = note?.$id || "";
        }

        setIsLoading(false);

        return welcomeNoteId;
    }


    return {
        createNoteExamples,
        isLoading
    }
}


