'use client'
import { useUser } from "@/context/SessionContext";
import useCollection from "@/hooks/appwrite/database/useCollection";
import useDocumentCreate from "@/hooks/appwrite/database/useDocumentCreate";
import useAuth from "@/hooks/appwrite/useAuth";
import { AppwriteIds } from "@/lib/appwrite-config";
import { redirect } from "next/navigation";
import { TbAppWindow } from "react-icons/tb";
import { Note } from "../../types/typings";
import { Permission, Role } from "appwrite";

const ShahilTesting = () => {
    const { createEmailAccount, login, logout } = useAuth();
    const { user, isLoggedIn } = useUser();


    if (isLoggedIn) {
        redirect('/workspace');
    }

    const { collection: allNotebooks, total: totalNotebooks, refresh: refreshNotebook } = useCollection({
        collection_id: AppwriteIds.collectionId_notebook
    });

    const handleCreateNotebook = async () => {
        if (user) {
            createNotebook({
                data: {
                    title: "This is a new notebook",
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            });
        }
    }

    const { create: createNotebook } = useDocumentCreate(AppwriteIds.collectionId_notebook);


    return (
        <div className="my-10">
            <button className="mx-3" onClick={() => createEmailAccount("test123@gmail.com", "12345678")}>Create Account</button>
            <button className="mx-3" onClick={() => login("test123@gmail.com", "12345678")}>Login</button>
            <button className="mx-3" onClick={logout}>Logout</button>
            <button className="mx-3" onClick={refreshNotebook}>Refresh Collection</button>
            <button className="mx-3" onClick={handleCreateNotebook}>Create Notebook</button>
        </div>
    );
}

export default ShahilTesting;