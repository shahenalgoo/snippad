'use client';

import { useNotebook } from "@/context/NotebookContext";
import { FC } from "react";

interface NotebookTestProps {

}

const NotebookTest: FC<NotebookTestProps> = () => {
    const { collection, total, defaultNotebookId, activeNotebookId, activateNotebook, createNotebook, deleteNotebook } = useNotebook();

    return (
        <>
            <div className="my-10">
                {/* <button className="mx-3" onClick={() => createEmailAccount("test123@gmail.com", "12345678")}>Create Account</button> */}
                {/* <button className="mx-3" onClick={() => login("test123@gmail.com", "12345678")}>Login</button> */}
                {/* <button className="mx-3" onClick={logout}>Logout</button> */}
                <button className="mx-3" onClick={() => activateNotebook("64762d31e4b03699331b", true)}>Select Default Notebook</button>
                <button className="mx-3" onClick={() => activateNotebook("6476ec1a8e188a011dc3", true)}>Select Another Notebook</button>
            </div>
        </>
    );
}

export default NotebookTest;