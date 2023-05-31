/**
 * Export hooks
 * 
 */


// System hooks
//
export { default as useToggle } from './useToggle';


// Appwrite Auth
//
export { default as useAuth } from './appwrite/useAuth';


// Appwrite Database Hooks
//
export { default as useCollection } from './appwrite/database/useCollection';
export { default as useDocumentCreate } from './appwrite/database/useDocumentCreate';
export { default as useDocumentUpdate } from './appwrite/database/useDocumentUpdate';
export { default as useDocumentDelete } from './appwrite/database/useDocumentDelete';