// React
import { FC } from "react";

// Typings
import { NoteStatus } from "@/types/enums";
import { Note } from "@/types/typings";

// Components
import { Notification } from "@/components";

interface NoticeCannotEditProps {
    note: Note | null;
}

const NoticeCannotEdit: FC<NoticeCannotEditProps> = ({ note }) => {

    return note?.status !== NoteStatus.published ? (
        <Notification variant='danger' className="mb-4 flex justify-between items-center">
            Cannot be edited while {note?.status === NoteStatus.archived ? 'archived' : 'trashed'}.
        </Notification>
    ) : null
}

export default NoticeCannotEdit;