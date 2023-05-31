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
                {/* <button className="mx-3" onClick={() => createNotebook("Another Notebook")}>Create Notebook</button> */}
                {defaultNotebookId ? <button className="mx-3" onClick={() => activateNotebook(defaultNotebookId)}>Personal Notebook</button> : <></>}
                {collection ? < button className="mx-3" onClick={() => activateNotebook(collection[1].$id)}>Another Notebook</button> : <></>}

            </div >
        </>
    );
}

export default NotebookTest;