import { FC } from "react";
import { Button, InputField } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";

interface CreateMagicSessionProps {

}

const CreateMagicSession: FC<CreateMagicSessionProps> = () => {
    return (
        <div className="flex gap-2">
            <InputField placeholder="Your email here..." />
            <Button className="w-10 p-0">
                <TbArrowNarrowRight size={20} strokeWidth={1.5} />
            </Button>
        </div>
    );
}

export default CreateMagicSession;