
import { AppwriteIds, databases } from "@/lib/appwrite-config";
import { useState } from "react";
import toast from "react-hot-toast";

interface IDelete {
    document_id: any,
    onSuccess?: () => any,
    onError?: () => any
}
export default function useDocumentDelete(collection_id: string) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const remove = async ({
        document_id,
        onSuccess,
        onError
    }: IDelete) => {
        toast.loading('Deleting...');

        try {
            // Delete document using arguments specifying which collection and document
            await databases.deleteDocument(AppwriteIds.databaseId, collection_id, document_id);

            // Execute OnSuccess, if any
            if (onSuccess) onSuccess();

            setIsLoading(false);
            toast.dismiss();
            toast.error('Delete Successful');
        } catch (error) {
            // Execute OnError, if any
            if (onError) onError();

            setIsLoading(false);
            toast.dismiss();
            toast.error('Unable to Delete');

        }
    }

    return {
        remove,
        isLoading
    }
}
