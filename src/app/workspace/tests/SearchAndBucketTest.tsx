import { useNotebook } from "@/context/NotebookContext";
import { useUser } from "@/context/SessionContext";
import { useDocumentUpdate } from "@/hooks";
import { AppwriteIds, account, client, databases, storage } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { ID, Permission, Query, Role } from "appwrite";
import { stringify } from "querystring";
import { FC, useCallback, useEffect, useState } from "react";

interface SearchTestProps {

}

const SearchTest: FC<SearchTestProps> = () => {
    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);

    const { activeNotebook } = useNotebook();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);

    const { user } = useUser();

    // Fetch Notes
    //
    const fetchNoteList = useCallback(async (searchText?: string) => {

        setIsLoading(true);

        try {

            // If no active notebook is found, cancel fetch.
            if (activeNotebook === null) {
                return;
            }

            // Set query to active notebook only
            //const queries: string[] = [Query.equal('notebook_related', activeNotebook.$id)]

            // Add search options
            // if (searchText) {
            //     queries.push(Query.search('body', searchText));
            // }

            // Fetch user's notes
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [
                    Query.equal('notebook_related', activeNotebook.$id) &&
                    Query.search('search_index', "cat"),
                    Query.orderDesc('$createdAt')
                ]
            );

            console.log(res.documents);

            // Temp code: use to quick delete while developing
            //
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            setNoteList(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [activeNotebook]);


    //Upload image

    const uploadImage = async () => {

        const element: HTMLInputElement = document.getElementById('uploader') as HTMLInputElement;
        if (!element.files || !user) {
            console.log("no file found");
            return;
        }
        const response = await storage.createFile(
            AppwriteIds.bucketId_images,
            ID.unique(),
            element.files[0],
            [
                Permission.read(Role.user(user?.$id || "")),
                Permission.update(Role.user(user?.$id || "")),
                Permission.delete(Role.user(user?.$id || "")),
            ]
        );

        console.log(response);

    }

    function fetchImage() {
        const response = storage.getFilePreview(AppwriteIds.bucketId_images, "647f032a23afd5d0bf54");

        return response.href
    }


    // Use effect
    //
    useEffect(() => {

        //Fetch Notes
        fetchNoteList();

        //Fetch Image Test
        fetchImage();

        // Subscribe to live changes for the user's notebook collection
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notes}.documents`, res => {
            fetchNoteList();
        });

        return () => {
            // Unsubscribe on unmount
            subscribe();
        }

    }, [fetchNoteList]);

    return (
        <>
            <input name="firstName" onChange={(e) => fetchNoteList(e.target.value)} />
            {/* <input type="file" id="uploader" onChange={uploadImage} /> */}
            {/* <img src={fetchImage()} alt="" /> */}
        </>
    );
}

export default SearchTest;