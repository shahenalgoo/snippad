import React, { createContext, useState, useEffect, useContext } from "react";
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";
import { Notebook } from "../../types/typings";
import { useUser } from "./SessionContext";
import useDocumentCreate from "@/hooks/appwrite/database/useDocumentCreate";
import useDocumentDelete from "@/hooks/appwrite/database/useDocumentDelete";
import Cookies from "universal-cookie";
import useDocumentUpdate from "@/hooks/appwrite/database/useDocumentUpdate";
import toast from "react-hot-toast";

type NotebookContextType = {
    isLoading: boolean
    collection: Notebook[] | null;
    total: number;
    defaultNotebookId: string | null;
    activeNotebookId: string | null;
    activateNotebook: (id: string, setCookie: boolean) => void;
    createNotebook: (id: string) => Promise<void>;
    updateNotebook: (document_id: string, title: string) => Promise<void>;
    deleteNotebook: (id: string) => void;
};

type NotebookProviderProps = {
    children: React.ReactNode;
};

const NotebookContext = createContext<NotebookContextType | null>(null)

export const useNotebook = (): NotebookContextType => {
    const context = useContext(NotebookContext);

    if (!context) {
        throw new Error('Hook must be used within an NotebookProvider');
    }

    return context;
};
export const NotebookProvider: React.FC<NotebookProviderProps> = ({ children }: any) => {
    // User data
    const { user } = useUser();

    // Notebook Variables
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<Notebook[] | null>(null);
    const [total, setTotal] = useState<number>(0);

    // Default Notebook
    const [defaultNotebookId, setDefaultNotebookId] = useState<string | null>(null);
    const defaultNotebookName = "Personal Notebook";

    // Current Active Notebook
    const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);

    // Cookies to save and retrieve last active notebook
    const cookies = new Cookies();
    const cookieNotebookRef = 'activeNotebookId'

    // Fetch notebooks
    //
    const fetchNotebooks = async () => {

        setIsLoading(true);

        try {
            // Query db for user's notebooks
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notebook
            );

            //console.log(res);
            // Set collection & total
            setCollection(res.documents as Notebook[]);
            setTotal(res.total);

            // The first document in the list is the default one
            if (res.total > 0) {
                setDefaultNotebookId(res.documents[0].$id);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    // Set selected notebook as active
    //
    const activateNotebook = async (id: string, setCookie: boolean) => {
        setActiveNotebookId(id);
        if (setCookie) {
            cookies.set(cookieNotebookRef, id);
        }
    }

    // Create a new notebook
    //
    const { create } = useDocumentCreate(AppwriteIds.collectionId_notebook);

    const createNotebook = async (title: string) => {
        // New notebook cannot be the same name as default notebook
        if (title === defaultNotebookName) {
            const msg: string = "'" + defaultNotebookName + "'" + " already exists"
            toast.error(msg);
            return;
        }

        if (user) {
            create({
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
    const { update } = useDocumentUpdate(AppwriteIds.collectionId_notebook);

    const updateNotebook = async (document_id: string, title: string) => {
        if (user) {
            update({
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
    const { remove } = useDocumentDelete(AppwriteIds.collectionId_notebook);

    const deleteNotebook = (id: string) => {
        remove({ document_id: id })

        // Switch active notebook to 'personal' IF the active notebook has been deleted
        if (activeNotebookId === id && defaultNotebookId) {
            activateNotebook(defaultNotebookId, true);
        }
    }

    useEffect(() => {
        // Fetch notebooks
        fetchNotebooks();

        // Fetch saved active notebook from cookies
        const lastNotebookUsed: string = cookies.get(cookieNotebookRef);

        // If found, set saved as active.
        if (lastNotebookUsed) {
            activateNotebook(lastNotebookUsed, false);
        }

        // Subscribe to live changes for the user's notebook collection
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notebook}.documents`,
            res => {
                // console.log("realtime triggered");
                fetchNotebooks();
            }
        );

    }, []);

    // Variables made available from context
    const contextValue: NotebookContextType = {
        isLoading,
        collection: collection as Notebook[] | null,
        total,
        defaultNotebookId,
        activeNotebookId,
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