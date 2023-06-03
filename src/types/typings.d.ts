import { Models } from "appwrite";
import { NoteType } from "./enums";

/**
 * Appwrite DB interfaces
 */

export interface IFetchCollection {
    collection_id: string,
    queries?: string[],
    onSuccess?: () => any,
    onError?: () => any
}

export interface ICreateDocument {
    data: any,
    permission?: string[],
    onSuccess?: () => any,
    onError?: () => any
}

export interface IUpdateDocument {
    document_id: string
    data: any,
    permission?: string[],
    onSuccess?: () => any,
    onError?: () => any
}

export interface IDeleteDocument {
    document_id: any,
    onSuccess?: () => any,
    onError?: () => any
}


/**
 * Extend default appwrite schema with custom fields
 * 
 */

export type Notebook = Models.Document & {
    title: string;
    notes_related: string[]
}

export type Note = Models.Document & {
    title: string;
    subtitle: string;
    body: string;
    notebook_related: string;
    type: NoteType
}


/**
 * Forms
 */

export type MagicForm = {
    email: string;
    url: string;
}

export type LoginForm = {
    email: string;
    password: string;
}

export type CreateAccountForm = {
    name: string;
    email: string;
    password: string;
}
