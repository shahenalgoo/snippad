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
        subtitle: "This note gives you an overview of Snippad's features.",
        body: "<h1>Code Snippets</h1><p>Snippad assists you in safeguarding and managing code snippets that you frequently find yourself needing in various projects.</p><p></p><ul><li><p>Press on the '+' in the sidebar to create a new one!</p></li><li><p>Once created, choose your preferred programming language and write/paste your code.</p></li><li><p>You call also save with CTRL+S on any kind of documents.</p></li></ul><h1>Rich-Text Notes</h1><p>You can <strong>highlight</strong> texts to find styling options such as bold, italic, strikethrough, lists, headings through a bubble menu. It also activates with Shift + Home/End. Then Press Tab to access the menu. Or you can simply click.</p><h3>Images</h3><p><img src='https://cloud.appwrite.io/v1/storage/buckets/648889d172680ede8d62/files/648a5b9df072a497b55c/preview?project=64887e9858264fda1199'></p><p>When you're on a new line, you can add images. Press enter after this text and click on the image icon to upload.</p><h1>To-do Lists</h1><p>No explanation needed here! You probably already coded your own.</p><p>You can drag-and-drop on any item to change its placement.</p><h1>Creating Notebooks (Collections)</h1><p>At the top of the sidebar, you can manage your notebooks. By default, we have created 'Personal' and 'Shared'.</p><p></p><p>In 'Manage Notebooks', you can create new notebooks and rename them. You cannot rename or delete 'Personal' and 'Shared'.</p><h3>Live Collab in 'Shared'</h3><p>You can share documents and do live collaboration with anyone in 'Shared' only.</p><p></p><p>It's still very experimental and is not optimized. For now, the basic function works.</p><p>There's no caret for the other user's live updates or doesn't say who you shared with.</p><p>You can share with 1 person only. Resharing will give access to the second person only.</p><h3>Organization Features</h3><p>You have options such as starring, archiving, trash, move to another notebook, sorting/filtering and searching.</p><p></p><p>Use the dropdown in the sidebar to access all, starred, archived or trash.</p><p></p><p>Trash notes can be recovered within 30 days. After that, they are automatically deleted.</p><h3>Light/Dark Mode</h3><p>Light/Dark mode are available within the menu on the top right.</p><p></p><p></p><p>Enjoy exploring Snippad and thank you for visiting!</p><p></p><p>Kind Regards,</p><p>Shahen &amp; Shahil</p><p></p>",
        type: NoteType.note,
        snippet_language: "html"
    },
    {
        title: "Appwrite's listDocuments",
        subtitle: "A code snippet example!",
        body: "import { Client, Databases } from 'appwrite';\n\nconst client = new Client();\n\nconst databases = new Databases(client);\n\nclient\n    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint\n    .setProject('5df5acd0d48c2') // Your project ID;\n\nconst promise = databases.listDocuments('[DATABASE_ID]', '[COLLECTION_ID]');\n\npromise.then(function (response) {\n    console.log(response); // Success\n}, function (error) {\n    console.log(error); // Failure\n});",
        type: NoteType.code,
        snippet_language: "javascript"
    }
];

