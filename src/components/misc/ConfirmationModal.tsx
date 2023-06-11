import { Button, Modal } from "@/components";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { FC, ReactNode } from "react";
import { IconBase, IconType } from "react-icons/lib";
import { TbTrashX } from "react-icons/tb";

/**
 * CONFIRMATION MODAL
 * 
 */
interface ConfirmationModalProps {
    confirmationMessage: ReactNode;
    confirmationButton: ReactNode;
    modalButton: ReactNode;
    modalActive: boolean;
    setModalActive: any
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    confirmationMessage,
    confirmationButton,
    modalButton,
    modalActive,
    setModalActive }) => {
    return (
        <>

            {/* Custom button to toggle modal */}
            {modalButton}

            {/* Modal content */}
            <Modal title="Are you sure?" modalActive={modalActive} onClose={() => setModalActive(!modalActive)} closeButton={false} closeWithBackdrop={false}>
                <div className="p-4 pt-0">
                    {confirmationMessage}
                    <div className="mt-8 flex justify-end gap-2">
                        <Button onClick={() => setModalActive(!modalActive)} variant='gray'>Cancel</Button>

                        {confirmationButton}
                    </div>
                </div>
            </Modal>
        </>
    );
}