/**
 * A context to handle notebooks globally
 * Also contains the useNotebook hook to access notebook data and states
 * 
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { Note, Notebook } from "@/types/typings";

import { useUser } from "./SessionContext";
import { useDocumentCreate, useDocumentUpdate, useDocumentDelete } from "@/hooks";

import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";

import Cookies from "universal-cookie";
import toast from "react-hot-toast";


// Notebook typings
//
type NotebookContextType = {
    isLoading: boolean
    collection: Notebook[] | null;
    total: number;

    defaultNotebook: Notebook | null;
    activeNotebook: Notebook | null;

    activateNotebook: (note: Notebook) => void;
    createNotebook: (id: string) => Promise<void>;
    updateNotebook: (document_id: string, title: string) => Promise<void>;
    deleteNotebook: (id: string) => void;
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
 * Used to wrap the /workspace
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


    // Default Names
    //
    const defaultNotebookName = "General";
    const cookieNotebookRef = "activeNotebookRef";


    // Init Cookies
    //
    const cookies = new Cookies();


    // User data
    //
    const { user } = useUser();


    // Fetch notebooks
    //
    const fetchNotebooks = async () => {

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


            // The first document in the list is the default one
            if (res.total > 0) {
                setDefaultNotebook(res.documents[0] as Notebook);

                if (!cookies.get(cookieNotebookRef)) {
                    activateNotebook(res.documents[0] as Notebook);
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    // Set selected notebook as active
    //
    const activateNotebook = async (notebook: Notebook) => {
        setActiveNotebook(notebook);

        // Also set it in cookies
        cookies.set(cookieNotebookRef, notebook);
    }


    // Create a new notebook
    //
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notebook);

    const createNotebook = async (title: string) => {
        // New notebook cannot be the same name as default notebook
        // if (title === defaultNotebookName) {
        //     const msg: string = "'" + defaultNotebookName + "'" + " already exists"
        //     toast.error(msg);
        //     return;
        // }

        if (user) {
            createDocument({
                data: {
                    title: title,
                } as Notebook,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            });
        }
    }


    // Update a notebook
    //
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notebook);

    const updateNotebook = async (document_id: string, title: string) => {
        if (user) {
            updateDocument({
                document_id: document_id,
                data: {
                    title: title,
                } as Notebook,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            });
        }
    }


    // Delete a notebook
    //
    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notebook);

    const deleteNotebook = (id: string) => {
        deleteDocument({ document_id: id })

        // Switch active notebook to 'personal' IF the active notebook has been deleted
        if (activeNotebook?.$id === id && defaultNotebook?.$id) {
            activateNotebook(defaultNotebook);
        }
    }


    // Use effect
    //
    useEffect(() => {

        // Fetch notebooks
        fetchNotebooks();

        // Fetch saved active notebook from cookies
        const lastNotebookUsed: Notebook = cookies.get(cookieNotebookRef);

        // If found, set saved as active.
        if (lastNotebookUsed) {
            activateNotebook(lastNotebookUsed);
        }

        // Subscribe to live changes for the user's notebook collection
        //
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notebook}.documents`,
            res => {
                // console.log("realtime triggered");
                fetchNotebooks();
            }
        );

    }, []);


    // Variables made available from context
    //
    const contextValue: NotebookContextType = {
        isLoading,
        collection: collection as Notebook[] | null,
        total,
        defaultNotebook,
        activeNotebook,
        activateNotebook,
        createNotebook,
        updateNotebook,
        deleteNotebook
    }


    return (
        <NotebookContext.Provider value={contextValue}>
            {children}
        </NotebookContext.Provider>
    )
}