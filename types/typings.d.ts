import { Models } from "appwrite";

export type Notebook = Models.Document & {
    title: string;
    notes_related: string[]
}

export type Note = Models.Document & {
    title: string;
    subtitle: string;
    body: string;
    notebook_related: string
}

// Appwrite DB interfaces 
interface IRead {
    collection_id: string,
    queries?: string[],
    onSuccess?: () => any,
    onError?: () => any
}

interface ICreate {
    data: any,
    permission: Permission[],
    onSuccess?: () => any,
    onError?: () => any
}

interface IUpdate {
    document_id: string
    data: any,
    permission: Permission[],
    onSuccess?: () => any,
    onError?: () => any
}
interface IDelete {
    document_id: any,
    onSuccess?: () => any,
    onError?: () => any
}