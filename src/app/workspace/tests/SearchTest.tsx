import { useNotebook } from "@/context/NotebookContext";
import { useUser } from "@/context/SessionContext";
import { useDocumentUpdate } from "@/hooks";
import { AppwriteIds, account, client, databases } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { Query } from "appwrite";
import { FC, useCallback, useEffect, useState } from "react";

interface SearchTestProps {

}

const SearchTest: FC<SearchTestProps> = () => {
    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);

    const { activeNotebookId } = useNotebook();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);

    const { user } = useUser();

    // Fetch Notes
    //
    const fetchNoteList = useCallback(async (searchText?: string) => {

        setIsLoading(true);

        try {

            // If no active notebook is found, cancel fetch.
            if (activeNotebookId === null) {
                return;
            }

            // Set query to active notebook only
            const queries: string[] = [Query.equal('notebook_related', activeNotebookId)]

            // Add search options
            if (searchText) {
                queries.push(Query.search('body', searchText));
            }

            // console.log(queries);

            // Query.equal('notebook_related', activeNotebookId),

            // Fetch user's notes
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [
                    Query.equal('notebook_related', activeNotebookId),
                    // Query.search('search_index', "human")
                ]
            );

            console.log(res.documents);

            // Temp code: use to quick delete while developing
            //
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            setNoteList(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [activeNotebookId]);



    // Use effect
    //
    useEffect(() => {

        //Fetch Notes
        fetchNoteList();

        // Subscribe to live changes for the user's notebook collection
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notes}.documents`, res => {
            fetchNoteList();
        });

        return () => {
            // Unsubscribe on unmount
            subscribe();
        }

    }, [fetchNoteList]);

    return (
        <>
            <input name="firstName" onChange={(e) => fetchNoteList(e.target.value)} />
        </>
    );
}

export default SearchTest;