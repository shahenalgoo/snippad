/**
 * A main file to configure Appwrite SDK
 * 
 */

import { Client, Account, Databases } from 'appwrite';


/**
 * Assign Appwrite IDs
 * 
 */
export const AppwriteIds = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    collectionId_notebook: process.env.NEXT_PUBLIC_COLLECTION_ID_NOTEBOOKS as string,
    collectionId_notes: process.env.NEXT_PUBLIC_COLLECTION_NOTES_ID as string,
    collectionId_test_notes: process.env.NEXT_PUBLIC_COLLECTION_TEST_NOTES_ID as string,
}


/**
 * Initiate Appwrite client
 * 
 */
export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);


/**
 * Initiate Account
 * 
 */
export const account = new Account(client);


/**
 * Initiate Database
 * 
 */
export const databases = new Databases(client);