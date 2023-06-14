/**
 * New user's first time default notes
 * Used as tutorial to demo features
 * 
 */

// Typings
import { NoteType } from "@/types/enums";

export const tutorialNotes = [
    {
        title: "Welcome to Snippad!",
        subtitle: "This note serves as a short tutorial!",
        body: "<p>Write tutorial here!</p><h1>This is an H1 in the body</h1><p></p><p>This is a sub paragraph of that H1.</p><p></p><p><strong>ss</strong></p><ul><li><p><strong>First Bullet</strong></p></li><li><p><strong>Second Bullet</strong></p></li><li><p>Third Bullet</p></li></ul>",
        type: NoteType.note,
        snippet_language: "html"
    },
    {
        title: "Code snippet example!",
        subtitle: "A simple hello world!",
        body: `function helloWorld() { \n  console.log('Hello World!');\n}`,
        type: NoteType.code,
        snippet_language: "javascript"
    },
    {
        title: "Appwrite's listDocuments",
        subtitle: "Fetching documents in a collection",
        body:
            "import { Client, Databases } from 'appwrite';\n\nconst client = new Client();\n\nconst databases = new Databases(client);\n\nclient\n    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint\n    .setProject('5df5acd0d48c2') // Your project ID;\n\nconst promise = databases.listDocuments('[DATABASE_ID]', '[COLLECTION_ID]');\n\npromise.then(function (response) {\n    console.log(response); // Success\n}, function (error) {\n    console.log(error); // Failure\n});",
        type: NoteType.code,
        snippet_language: "javascript"
    }
];