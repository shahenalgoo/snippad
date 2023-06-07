'use client';

// React
import { FC, useState, useRef, useEffect } from "react";

// Typings
import { Notebook } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Icons
import { TbDeviceFloppy, TbEdit, TbNotebook, TbTrash } from "react-icons/tb";
import { Box, Button } from "@/components";


interface SettingsPageProps {

}

interface NotebookCardProps {
    notebook: Notebook
}


const NotebookCard: FC<NotebookCardProps> = ({ notebook }) => {

    const [canEdit, setCanEdit] = useState<boolean>(false);

    const ref = useRef<any>(null);

    useEffect(() => {
        if (ref && ref.current && canEdit === true) {
            ref.current.focus();
        }
    }, [canEdit, ref]);

    return (
        <Box key={notebook.$id} variant='border' rounded='default' className={`py-0 mb-4 last:mb-0 ${canEdit ? 'border-primary' : ''}`}>
            <form className="flex items-center justify-between">
                <div className="flex-1 flex items-center text-sm font-semibold">
                    <TbNotebook size={24} strokeWidth={1} className="mr-2 " />

                    <input
                        type="text"
                        defaultValue={notebook.title}
                        disabled={!canEdit}
                        ref={ref}
                        className="w-full h-14 outline-none disabled:bg-transparent"
                    />

                </div>

                <div className="flex gap-2">
                    {!canEdit &&
                        <>
                            <Button type="button" onClick={() => setCanEdit(!canEdit)} variant='gray' size='square'>
                                <TbEdit size={20} strokeWidth={1} />
                            </Button>
                            <Button type="button" variant='gray' size='square'>
                                <TbTrash size={20} strokeWidth={1} />
                            </Button>
                        </>
                    }
                    {canEdit &&
                        <Button type="button" size='square'>
                            <TbDeviceFloppy size={20} strokeWidth={1.5} />
                        </Button>
                    }
                </div>
            </form>
        </Box>
    );
}



const SettingsPage: FC<SettingsPageProps> = () => {

    const { collection: notebookList } = useNotebook();

    return (
        <div>
            {notebookList?.map((notebook: Notebook) => (
                <NotebookCard key={notebook?.$id} notebook={notebook} />
            ))}
        </div>
    );
}

export default SettingsPage;








