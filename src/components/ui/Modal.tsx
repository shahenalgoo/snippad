
import Button from "./Button";
import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
    modalActive?: any;
    onClose?: any;
    children?: any;
    closeButton?: boolean;
}

export default function Modal({ modalActive, onClose, children, closeButton = true }: ModalProps) {

    return modalActive ? (
        <div onClick={onClose} className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-95 flex justify-center items-center over">

            {closeButton &&
                <Button onClick={onClose} className="absolute top-5 right-5 z-50 w-[50px] h-[50px] px-0">
                    <IoCloseOutline size={24} className='' />
                </Button>
            }

            {children}
        </div>
    ) : null;

}