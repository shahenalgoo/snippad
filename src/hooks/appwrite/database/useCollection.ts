import { useState, useEffect, useCallback } from "react";

import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Models } from "appwrite";
import { IRead } from "../../../../types/typings";

export default function useCollection({
    collection_id,
    queries,
    onSuccess,
    onError
}: IRead) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<Models.Document[] | null>(null);
    const [total, setTotal] = useState<number>(0);

    const fetchCollection = useCallback(async () => {

        // setIsLoading(true);

        try {
            // Query database
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                collection_id,
                queries ? queries : []
            );

            // Update collection
            setCollection(res.documents);
            setTotal(res.total);

            // Execute OnSuccess, if any
            if (onSuccess) onSuccess();

        } catch (error) {
            console.log(error);

            //Execute OnError, if any
            if (onError) onError();
        } finally {
            setIsLoading(false);
        }

    }, []);

    useEffect(() => {
        //subscribe to live changes for the user's collection of documents
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${collection_id}.documents`,
            res => {
                // console.log("realtime triggered");
                fetchCollection();
            }
        );

        // First time fetch
        fetchCollection();


    }, []);

    return {
        collection,
        total,
        isLoading,
        fetch: fetchCollection
    }
}