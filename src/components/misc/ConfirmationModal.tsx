/**
 * General confirmation modal
 * 
 */

// React
import { FC, ReactNode } from "react";

// Components
import { Button, Modal } from "@/components";


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
    setModalActive
}) => {

    return (
        <>

            {/* Custom button to toggle modal */}
            {modalButton}

            {/* Modal content */}
            <Modal title="Are you sure?" modalActive={modalActive} onClose={() => setModalActive(!modalActive)} closeButton={false} closeWithBackdrop={false}>
                <div className="p-4 pt-0">
                    {confirmationMessage}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-2">
                        <Button onClick={() => setModalActive(!modalActive)} variant='gray'>Cancel</Button>

                        {confirmationButton}
                    </div>
                </div>
            </Modal>
        </>
    );
}