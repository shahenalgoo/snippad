// React
import { FC } from "react";

// Typigs
import { NoteStatus } from "@/types/enums";
import { Note } from "@/types/typings";

// Components
import { Notification } from "@/components";
import DeletePermanently from "../delete-permanently/DeletePermanently";

// Utils
import { daysLeft } from "@/utils/dates-difference-in-days";

interface NoticeTrashAutodeletionProps {
    note: Note | null;
}

const NoticeTrashAutodeletion: FC<NoticeTrashAutodeletionProps> = ({ note }) => {

    return note?.status === NoteStatus.trashed ? (
        <Notification variant='danger' className="mb-4 flex justify-between items-center">

            {/* Trashed notes are automatically deleted after 30 days. This note has {daysLeft(note.status_last_update)} day(s) left. */}
            {daysLeft(note.status_last_update)} day(s) left until automatic deletion.

            <DeletePermanently note={note} />

        </Notification>
    ) : null

}

export default NoticeTrashAutodeletion;