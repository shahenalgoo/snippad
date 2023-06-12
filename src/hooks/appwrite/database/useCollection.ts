/**
 * A hook to fetch collections
 * 
 */

// React
import { useState, useEffect, useCallback } from "react";

// Typings
import { IFetchCollection } from "@/types/typings";

// Appwrite
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Models } from "appwrite";


/**
 * Use to fetch a collection
 * 
 * @param collection_id id of collection to be fetched
 * @param queries (optional) filter with custom queries
 * @param onSuccess (optional) custom functions on success
 * @param OnError (optional) custom functions on error
 * 
 */
export default function useCollection({
    collection_id,
    queries,
    onSuccess,
    onError
}: IFetchCollection) {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<Models.Document[] | null>(null);
    const [total, setTotal] = useState<number>(0);


    // Fetch collection
    //
    const fetchCollection = useCallback(async () => {

        setIsLoading(true);

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


    // Use effect
    //
    useEffect(() => {

        // Subscribe to live changes for the user's collection of documents
        //
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${collection_id}.documents`, res => {
            fetchCollection();
        });

        // First time fetch
        //
        fetchCollection();

    }, []);


    return {
        collection,
        total,
        isLoading,
        fetch: fetchCollection
    }
}