/**
 * A hook to delete documents
 * 
 */

// React
import { useState } from "react";

// Typings
import { IDeleteDocument } from "@/types/typings";

// Appwrite
import { AppwriteIds, databases } from "@/lib/appwrite-config";

// Misc
import toast from "react-hot-toast";


/**
 * Use to delete documents
 * 
 * @param collection_id id of parent collection
 * @returns deleteDocument function
 * @returns isLoading state
 * 
 */
export default function useDocumentDelete(collection_id: string) {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);


    /**
     * DELETE DOCUMENT
     * 
     * @param document_id id of the document to be deleted
     * @param onSuccess (optional) custom functions on success
     * @param OnError (optional) custom functions on error
     * 
     */
    const deleteDocument = async ({
        document_id,
        onSuccess,
        onError
    }: IDeleteDocument) => {

        setIsLoading(true);
        toast.loading('Deleting...');

        try {
            // Delete document using arguments specifying which collection and document
            await databases.deleteDocument(AppwriteIds.databaseId, collection_id, document_id);

            // Execute OnSuccess, if any
            if (onSuccess) onSuccess();

            toast.dismiss();
            toast.success('Deleted');

        } catch (error) {
            // Execute OnError, if any
            if (onError) onError();

            toast.dismiss();
            toast.error('Unable to delete');

        } finally {
            setIsLoading(false);
        }
    }


    return {
        deleteDocument,
        isLoading
    }
}
