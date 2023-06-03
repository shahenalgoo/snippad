/**
 * A hook to create new documents
 * 
 */

import { useState } from "react";
import { ICreateDocument } from "@/types/typings";

import { databases, AppwriteIds } from "@/lib/appwrite-config";
import { ID } from "appwrite";


/**
 * Use to create documents
 * @param collection_id id of parent collection
 * @returns createDocument function
 * @returns isLoading state
 */
export default function useDocumentCreate(collection_id: string) {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);


    /**
     * CREATE NEW DOCUMENT
     * 
     * @param data data to fill in new document
     * @param permission (optional) set user permissions
     * @param onSuccess (optional) custom functions on success
     * @param OnError (optional) custom functions on error
     * 
     */
    const createDocument = async ({
        data,
        permission,
        onSuccess,
        onError
    }: ICreateDocument) => {

        setIsLoading(true);

        try {

            // Create document with the arguments: collection_id, data & permissions
            const res = await databases.createDocument(
                AppwriteIds.databaseId,
                collection_id,
                ID.unique(),
                data,
                permission ? permission : []
            );

            // Execute OnSuccess, if any
            if (onSuccess) onSuccess();

        } catch (error) {
            console.log(error);

            // Execute OnError, if any
            if (onError) onError();

        } finally {
            setIsLoading(false);
        }

    }


    return {
        createDocument,
        isLoading
    }
}