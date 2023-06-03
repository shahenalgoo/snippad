import { FC } from "react";
import { Button } from "@/components";

import { TbDeviceFloppy, TbJewishStar, TbTrash, TbArchive } from "react-icons/tb";

interface NoteHeaderProps {
    editor: any;
    isSaving: boolean
}

const NoteHeader: FC<NoteHeaderProps> = ({ editor, isSaving }) => {
    return (
        // <nav className="lg:fixed top-0 left-0 lg:left-80 xl:left-96 z-40 w-full lg:w-[calc(100%_-_20rem)] xl:w-[calc(100%_-_24rem)] h-16 lg:px-4 flex items-center justify-end lg:border-b border-slate-200 bg-white">
        //     <Button type="submit" disabled={isSaving}>
        //         Save Note
        //     </Button>
        // </nav>

        <div className="fixed top-3 right-3 z-40 rounded-full py-1 px-2 bg-slate-200">
            <Button variant='primary' rounded='full' type="submit" disabled={isSaving} className="mr-3">
                <TbDeviceFloppy size={18} className="mr-2" />
                Save Note
            </Button>
            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbJewishStar />
            </Button>





            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbArchive />
            </Button>

            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbTrash />
            </Button>
        </div>
    );
}

export default NoteHeader;