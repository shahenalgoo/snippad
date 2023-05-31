import React, { createContext, useState, useEffect, useContext } from "react";
import { AppwriteIds } from "@/lib/appwrite-config";
import { Models, Permission, Role } from "appwrite";
import { ICreate, Notebook } from "../../types/typings";
import useCollection from "@/hooks/appwrite/database/useCollection";
import { useUser } from "./SessionContext";
import useDocumentCreate from "@/hooks/appwrite/database/useDocumentCreate";
import useDocumentDelete from "@/hooks/appwrite/database/useDocumentDelete";
import Cookies from "universal-cookie";
import { unmountComponentAtNode } from "react-dom";
import useDocumentUpdate from "@/hooks/appwrite/database/useDocumentUpdate";

type NotebookContextType = {
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

    // Current Active Notebook
    const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);

    // Cookies to retrieve save and retrieve last active notebook
    const cookies = new Cookies();
    const cookieNotebookRef = 'activeNotebookId'

    // Getting list of user's notebooks
    const { collection, total } = useCollection({
        collection_id: AppwriteIds.collectionId_notebook
    });

    // Default Notebook
    const defaultNotebookId = collection ? collection[0].$id : null;

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
                document_id: "",
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
        // Fetch saved active notebook from cookies
        const lastNotebookUsed: string = cookies.get(cookieNotebookRef);

        // If found, set saved as active.
        if (lastNotebookUsed) {
            activateNotebook(lastNotebookUsed, false);
        }

    }, []);

    // Variables made available from context
    const contextValue: NotebookContextType = {
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