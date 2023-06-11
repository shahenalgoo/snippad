/**
 * Export hooks
 * 
 */


// Hooks
//
export { default as useToggle } from './useToggle';
export { default as useNoteExamples } from './useNoteExamples';
export { default as useUnsavedChangesWarning } from './useUnsavedChangesWarning';


// Appwrite Auth
//
export { default as useAuth } from './appwrite/useAuth';


// Appwrite Database Hooks
//
export { default as useCollection } from './appwrite/database/useCollection';
export { default as useDocumentCreate } from './appwrite/database/useDocumentCreate';
export { default as useDocumentUpdate } from './appwrite/database/useDocumentUpdate';
export { default as useDocumentDelete } from './appwrite/database/useDocumentDelete';