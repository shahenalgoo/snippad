import { Models } from "appwrite";
import { NoteStatus, NoteType } from "./enums";

/**
 * Appwrite DB interfaces
 */

// Interface used in hooks/useCollection to fetch data
//
export interface IFetchCollection {
    collection_id: string;
    queries?: string[];
    onSuccess?: () => any;
    onError?: () => any;
}

// Interface used in hooks/useDocumentCreate to create documents
//
export interface ICreateDocument {
    data: any;
    permission?: string[];
    onSuccess?: () => any;
    onError?: () => any;
}

// Interface used in hooks/useDocumentUpdate to update documents
//
export interface IUpdateDocument {
    document_id: string;
    data: any;
    permission?: string[];
    onSuccess?: () => any;
    onError?: () => any;
}

// Interface used in hooks/useDocumentDelete to delete documents
//
export interface IDeleteDocument {
    document_id: any;
    onSuccess?: () => any;
    onError?: () => any;
}


/**
 * Extend default appwrite schema with custom fields
 * 
 */

export type Notebook = Models.Document & {
    title: string;
}

export type Note = Models.Document & {
    title: string;
    subtitle: string;
    body: string;
    notebook_related: string;
    type: NoteType;
    starred: boolean;
    status: NoteStatus;
    status_last_update: Date;
    snippet_language: string;
    search_index: string;
}


/**
 * TODO
 * 
 */
export interface Todo {
    title: string;
    done: boolean;
    order: number
}

/**
 * AUTHENTICATION
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

export type RecoverForm = {
    email: string;
    url: string;
}

export type PasswordResetForm = {
    password: string;
    passwordAgain: string;
}


/**
 * NOTES
 */

// Note Form
export type NoteFormData = {
    title: string;
    subtitle: string;
    body: string;
    snippet_language?: string;
    status: NoteStatus;
}

/**
 * CODE LANGUAGE TYPE
 * used by code editor
 */

// Snippet supported languages
export type SnippetLanguage = {
    name: string;
    alias: string;
}