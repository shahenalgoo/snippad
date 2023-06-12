/**
 * MAGIC LOGIN
 * 
 */

'use client';

// React
import { FC } from "react";

// Hooks
import { useAuth } from "@/hooks";
import { useUser } from "@/context/SessionContext";

// Components
import { Button, InputField } from "@/components";

// Icons
import { TbArrowNarrowRight } from "react-icons/tb";


const CreateMagicSession: FC = () => {

    // Hooks
    //
    const { magicLogin, magicForm, setMagicForm } = useAuth();
    const { isLoading } = useUser();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMagicForm({ ...magicForm, email: e.target.value })
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await magicLogin(magicForm.email, `${process.env.NEXT_PUBLIC_APP_URL}/confirm-magic-session`)
    }


    return (
        <form onSubmit={onSubmit} className="flex gap-2">

            <InputField
                id="email"
                type='email'
                defaultValue={magicForm.email}
                onChange={onFieldChange}
                disabled={isLoading}
                placeholder="Your email here..."
            />

            <Button type="submit" className="w-10 p-0">
                <TbArrowNarrowRight size={20} strokeWidth={1.5} />
            </Button>

        </form>
    );
}

export default CreateMagicSession;