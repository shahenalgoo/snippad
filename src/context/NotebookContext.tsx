/**
 * A context to handle notebooks globally
 * Also contains the useNotebook hook to access notebook data and states
 * 
 */

// React
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";

// Typings
import { Note, Notebook } from "@/types/typings";

// Hooks
import { useUser } from "./SessionContext";
import { useDocumentCreate, useDocumentUpdate, useDocumentDelete } from "@/hooks";
import { useNoteExamples } from "@/hooks";

// Appwrite
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Query, Role } from "appwrite";

// Misc
import toast from "react-hot-toast";


// Notebook typings
//
type NotebookContextType = {
    isLoading: boolean
    collection: Notebook[] | null;
    total: number;

    defaultNotebookName: string;
    notebookLimit: number;

    defaultNotebook: Notebook | null;
    activeNotebook: Notebook | null;

    activateNotebook: (note: Notebook, backToWorkspace?: boolean) => void;
    createNotebook: (id: string, isFirst?: boolean) => Promise<void>;
    updateNotebook: (document_id: string, title: string) => Promise<void>;
    deleteNotebook: (id: string) => void;

    allNotes: Note[] | null;
    isLoadingAllNotes: boolean;
    fetchNotes: () => Promise<void>;
};

type NotebookProviderProps = {
    children: React.ReactNode;
};


// Create new context
//
const NotebookContext = createContext<NotebookContextType | null>(null)


// Hook to access context
//
export const useNotebook = (): NotebookContextType => {
    const context = useContext(NotebookContext);

    if (!context) {
        throw new Error('Hook must be used within NotebookProvider context');
    }

    return context;
};


/**
 * Notebook Provider
 * Used to wrap the /workspace and make notebooks' data easily available everywhere
 * 
 */
export const NotebookProvider: React.FC<NotebookProviderProps> = ({ children }: any) => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<Notebook[] | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [defaultNotebook, setDefaultNotebook] = useState<Notebook | null>(null);
    const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);
    const [allNotes, setAllNotes] = useState<Note[] | null>(null);
    const [isLoadingAllNotes, setIsLoadingAllNotes] = useState<boolean>(true);
    const [isFirstTimeLoad, setIsFirstTimeLoad] = useState<boolean>(true);


    // Default Names/Amounts
    //
    const defaultNotebookName = "Personal";
    const storageNotebookRef = "activeNotebookRef";
    const notebookLimit = 3;
    //let firstTimeLoad = true;

    // Notebook ref for local storage
    let lastNotebookUsed: Notebook;


    // Hooks
    //
    const { user } = useUser();
    const router = useRouter();
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notebook);
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notebook);
    const { createNoteExamples } = useNoteExamples();


    // Fetch notebooks
    //
    const fetchNotebooks = async () => {

        setIsLoading(true);

        try {

            // Fetch user's notebooks
            const res = await databases.listDocuments(AppwriteIds.databaseId, AppwriteIds.collectionId_notebook);

            // Set collection & total
            setCollection(res.documents as Notebook[]);
            setTotal(res.total);

            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notebook, element.$id)
            // });

            // If no notebooks are found, return.
            if (res.total == 0) return;

            // The first document in the list is the default one: called ''Personal'
            if (defaultNotebook === null) setDefaultNotebook(res.documents[0] as Notebook);

            // Auto-activate notebook on first time load
            if (isFirstTimeLoad) {
                onLoadActivateNotebook(res.documents as Notebook[]);
                setIsFirstTimeLoad(false);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }


    // Activate a notebook on first time load
    //
    const onLoadActivateNotebook = async (notebooks: Notebook[]) => {

        // If we found notebook in local storage
        // Check if it exists in fetched notebooks first, activate it. 
        let isFound = false;
        if (lastNotebookUsed) {

            for (let i = 0; i < notebooks.length; i++) {
                if (lastNotebookUsed.$id == notebooks[i].$id) {
                    isFound = true;
                    activateNotebook(lastNotebookUsed);
                    return;
                }
            }
        }

        // If not found or the notebook found is not in fetched notebooks, set default active and save in local storage
        if (!isFound || !lastNotebookUsed) {
            activateNotebook(notebooks[0]);
            if (defaultNotebook) localStorage.setItem(storageNotebookRef, JSON.stringify(defaultNotebook));

        }
    }


    // Set selected notebook as active
    //
    const activateNotebook = async (notebook: Notebook, backToWorkspace?: boolean) => {

        setActiveNotebook(notebook);

        if (localStorage.getItem(storageNotebookRef)) {
            localStorage.setItem(storageNotebookRef, JSON.stringify(notebook));
        }

        if (backToWorkspace) {
            router.push('/workspace');
        }
    }


    // Create a notebook
    //
    const createNotebook = async (title: string, isFirst?: boolean) => {
        // Abort if user not found
        if (!user) return

        // New notebook cannot be the same name as default notebook
        if (title === defaultNotebookName && !isFirst) {
            const msg: string = "Choose another name."
            toast.error(msg);
            return;
        }

        // Check limit
        if (total >= notebookLimit) {
            toast.error("Notebook Limit Reached");
            return;
        }

        // If first notebook, give permission to read only
        const newNotebook = await createDocument({
            data: {
                title: isFirst ? defaultNotebookName : title,
            } as Notebook,
            permission: isFirst ? [Permission.read(Role.user(user.$id))] : undefined
        });

        // Automatically create some tutorial/example notes for the first 'Personal Notebook'
        if (isFirst && newNotebook) {
            const welcomeNoteId = await createNoteExamples(newNotebook.$id);
            router.push('/workspace/' + welcomeNoteId);
        }

    }


    // Update a notebook
    //
    const updateNotebook = async (document_id: string, title: string) => {
        if (user) {
            updateDocument({
                document_id: document_id,
                data: {
                    title: title,
                } as Notebook,
                onSuccess() {

                }
            });
        }
    }


    // Delete a notebook
    //
    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notebook);

    const deleteNotebook = (id: string) => {
        deleteDocument({ document_id: id })

        // Switch active notebook to 'Personal' If the active notebook has been deleted
        if (activeNotebook?.$id === id && defaultNotebook?.$id) {
            activateNotebook(defaultNotebook);
        }
    }


    //Fetch all notes for active notebook, for limit controls and stat display
    //
    const fetchNotes = useCallback(async () => {
        // Fetch only if activeNotebook has been set
        if (!activeNotebook) return;

        setIsLoadingAllNotes(true);

        try {
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [
                    Query.equal("notebook_related", activeNotebook.$id)
                ]
            );

            // Temp code: use to quick delete while developing
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            // Set state
            setAllNotes(res.documents as Note[])

        } catch (error) {
            console.log(error);

        } finally {
            setIsLoadingAllNotes(false);
        }

    }, [activeNotebook]);


    // Use effect for first time notebooks fetch
    //
    useEffect(() => {

        // Fetch notebooks
        fetchNotebooks();

        // Fetch saved active notebook from local storage
        const savedNotebook: string | null = localStorage.getItem(storageNotebookRef);

        // If found, assign it
        if (savedNotebook) lastNotebookUsed = JSON.parse(savedNotebook);

    }, []);


    //Use effect to update ALL notes for active notebook and subscribe to notebook changes
    //
    useEffect(() => {
        // Fetch notes for when active notebook is changed or found (first time)
        fetchNotes();

        // Subscribe to live changes for the user's notebook collection
        //
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notebook}.documents`,
            res => {
                // Ref to the notebook that changed
                const eventNotebook: Notebook = res.payload as Notebook;

                // If the event was an update
                if (res.events[0].includes("update") && eventNotebook.$id === activeNotebook?.$id) {
                    // Reactivate if it already was (to get the updates to show)
                    activateNotebook(eventNotebook);
                }

                // Fetch again.
                fetchNotebooks();
            }
        );

        return () => {
            subscribe();
        }

    }, [fetchNotes]);


    // Variables made available from context
    //
    const contextValue: NotebookContextType = {
        isLoading,
        collection: collection as Notebook[],
        total,
        defaultNotebookName,
        notebookLimit,
        defaultNotebook,
        activeNotebook,
        activateNotebook,
        createNotebook,
        updateNotebook,
        deleteNotebook,
        allNotes,
        isLoadingAllNotes,
        fetchNotes
    }

    return (
        <NotebookContext.Provider value={contextValue}>
            {children}
        </NotebookContext.Provider>
    )
}