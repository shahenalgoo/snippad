/**
 * A hook to update documents
 * 
 */

// React
import { useState } from "react";

// Typings
import { IUpdateDocument } from "@/types/typings";

// Hooks
import { useUser } from "@/context/SessionContext";

// Appwrite
import { databases, AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";


/**
 * Use to update documents
 * 
 * @param collection_id id of parent collection
 * @returns updateDocument function
 * @returns isLoading state
 * 
 */
export default function useDocumentUpdate(collection_id: string) {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useUser();


    /**
     * UPDATE DOCUMENT
     * 
     * @param document_id id of document to be updated
     * @param data data to fill in new document
     * @param permission set user permissions
     * @param onSuccess custom functions on success
     * @param OnError custom functions on error
     * 
     */
    const updateDocument = async ({
        document_id,
        data,
        permission,
        onSuccess,
        onError
    }: IUpdateDocument) => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Update document with the arguments: collection_id, document_id, data & permissions
            const res = await databases.updateDocument(
                AppwriteIds.databaseId,
                collection_id,
                document_id,
                data,
                permission ? permission : [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            );

            // Execute OnSuccess, if any
            if (onSuccess) onSuccess();
            return res;
        } catch (error) {
            console.log(error);

            // Execute OnError, if any
            if (onError) onError();

        } finally {
            setIsLoading(false);
        }
    }


    return {
        updateDocument,
        isLoading
    }
}