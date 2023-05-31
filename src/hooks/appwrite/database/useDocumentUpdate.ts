
import { useState } from "react";

import { databases, AppwriteIds } from "@/lib/appwrite-config";
import { ID, Permission } from "appwrite";
import { IUpdate } from "../../../../types/typings";


export default function useDocumentUpdate(collection_id: string) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const update = async ({
        document_id,
        data,
        permission,
        onSuccess,
        onError
    }: IUpdate) => {

        setIsLoading(true);

        try {
            // Update document with the arguments: collection_id, document_id, data & permissions
            const res = await databases.updateDocument(
                AppwriteIds.databaseId,
                collection_id,
                document_id,
                data,
                permission as string[]
            );

            // console.log(res);

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
        update,
        isLoading
    }
}