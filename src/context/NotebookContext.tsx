/**
 * A context to handle notebooks globally
 * Also contains the useNotebook hook to access notebook data and states
 * 
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Note, Notebook } from "@/types/typings";

import { useUser } from "./SessionContext";
import { useDocumentCreate, useDocumentUpdate, useDocumentDelete } from "@/hooks";
import { useRouter } from "next/navigation";

import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Query, Role } from "appwrite";

import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { NoteStatus, NoteType } from "@/types/enums";
import { useNoteExamples } from "@/hooks";
import { skip } from "node:test";



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
        throw new Error('Hook must be used within an NotebookProvider');
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

    // Default Names/Amounts
    //
    const defaultNotebookName = "General Notebook";
    const cookieNotebookRef = "activeNotebookRef";
    const notebookLimit = 3;

    // Init Cookies
    //
    const cookies = new Cookies();
    let lastNotebookUsed: Notebook;

    // Hooks
    //
    const { user } = useUser();
    const router = useRouter();
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notebook);
    const { createDocument: createFirstNote } = useDocumentCreate(AppwriteIds.collectionId_notes);
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notebook);

    const { createNoteExamples } = useNoteExamples();


    // Fetch notebooks
    //
    const fetchNotebooks = async (skipActivation?: boolean, eventNotebook?: Notebook) => {

        setIsLoading(true);

        try {

            // Fetch user's notebooks
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notebook
            );

            // Set collection & total
            setCollection(res.documents as Notebook[]);
            setTotal(res.total);

            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notebook, element.$id)
            // });


            if (res.total == 0) return;

            // Skip notebook activation when realtime triggers.
            if (skipActivation) {
                // Update active notebook only if eventNotebook is the same as the one currently active.
                if (activeNotebook && eventNotebook?.$id === activeNotebook?.$id) {
                    activateNotebook(eventNotebook);
                }
                return;
            }

            // The first document in the list is the default one: called ''General'
            setDefaultNotebook(res.documents[0] as Notebook);

            if (!cookies.get(cookieNotebookRef)) {
                activateNotebook(res.documents[0] as Notebook);
            }

            let isFound = false;

            // If cookie found is also in fetched notebooks, set saved. 
            if (lastNotebookUsed) {
                for (let i = 0; i < res.documents.length; i++) {
                    if (lastNotebookUsed.$id == res.documents[i].$id) {
                        isFound = true;
                        activateNotebook(lastNotebookUsed);
                        break;
                    }
                }

                //If notebook saved in cookie not found, set default as active and save in cookie
                if (!isFound) {
                    activateNotebook(res.documents[0] as Notebook);
                    cookies.set(cookieNotebookRef, defaultNotebook);
                }

            } else {
                //create cookie with default
                cookies.set(cookieNotebookRef, defaultNotebook);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    // Set selected notebook as active
    //
    const activateNotebook = async (notebook: Notebook, backToWorkspace?: boolean) => {
        console.log("active notebook is changing");

        setActiveNotebook(notebook);

        // Also set it in cookies, check first if cookies exists.
        if (cookies.get(cookieNotebookRef)) {
            cookies.set(cookieNotebookRef, notebook);
        }

        if (backToWorkspace) {
            router.push('/workspace');
        }
    }


    // Create a new notebook
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
            permission: isFirst ? [Permission.read(Role.user(user.$id)), Permission.delete(Role.user(user.$id))] : undefined
        });

        // Automatically create some tutorial/example notes for the first 'General Notebook'
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

        // Switch active notebook to 'General' If the active notebook has been deleted
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


    // Use effect for notebooks
    //
    useEffect(() => {

        // Fetch notebooks
        fetchNotebooks();

        // Fetch saved active notebook from cookies
        lastNotebookUsed = cookies.get(cookieNotebookRef);

        // Subscribe to live changes for the user's notebook collection
        //
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notebook}.documents`,
            res => {

                const eventNotebook: Notebook = res.payload as Notebook;

                fetchNotebooks(true, eventNotebook);
            }
        );

    }, []);


    //Use effect to update ALL notes for active notebook
    //
    useEffect(() => {
        // Fetch notes for when active notebook is changed or found (first time)
        fetchNotes();

    }, [fetchNotes]);


    // Variables made available from context
    //
    const contextValue: NotebookContextType = {
        isLoading,
        collection: collection as Notebook[] | null,
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