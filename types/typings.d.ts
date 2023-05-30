import { Models } from "appwrite";

export interface Notebook extends Models.Document {
    title: string;
    notes_related: string[]
}

export interface Note extends Models.Document {
    title: string;
    subtitle: string;
    body: string;
    notebook_related: string
}
