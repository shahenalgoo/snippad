import { Button, InputField, Modal } from "@/components";
import { useToggle } from "@/hooks";
import { Dispatch, FC, SetStateAction } from "react";
import { TbShare2 } from "react-icons/tb";

interface ShareNoteProps {
    shareNote: (e: React.FormEvent<HTMLFormElement>) => void;
    shareEmail: string | null;
    setShareEmail: Dispatch<SetStateAction<string | null>>
}

const ShareNote: FC<ShareNoteProps> = ({
    shareNote,
    setShareEmail
}) => {

    // States
    //
    const [modalActive, setModalActive] = useToggle();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShareEmail(e.target.value)
    }

    return (
        <>
            <button onClick={() => setModalActive(!modalActive)} title="Share this document" type="button" className="hidden lg:flex overflow-hidden w-12 h-12 lg:ml-3 lg:mt-[2px] rounded-full items-center justify-center bg-neutral-100 dark:bg-black">
                <TbShare2 size={24} strokeWidth={1} />
            </button>

            <Modal
                modalActive={modalActive}
                onClose={() => setModalActive(!modalActive)}
                title="Share with a friend."
            >

                <div className="p-4">
                    <form onSubmit={shareNote} className="flex gap-2">

                        <InputField
                            type='email'
                            onChange={onFieldChange}
                            placeholder="Email address..."
                        />

                        <Button type="submit">
                            Share
                        </Button>

                    </form>
                </div>

            </Modal >
        </>
    );
}

export default ShareNote;