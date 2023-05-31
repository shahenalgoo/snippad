
import { useState } from "react";

import { databases, AppwriteIds } from "@/lib/appwrite-config";
import { ID, Permission } from "appwrite";
import { ICreate } from "../../../../types/typings";


export default function useDocumentCreate(collection_id: string) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const create = async ({
        data,
        permission,
        onSuccess,
        onError
    }: ICreate) => {

        setIsLoading(true);

        try {
            // Create document with the arguments: collection_id, data & permissions
            const res = await databases.createDocument(
                AppwriteIds.databaseId,
                collection_id,
                ID.unique(),
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
        create,
        isLoading
    }
}