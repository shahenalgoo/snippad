/**
 * Traditional login component
 * 
 */

'use client';

import { FC } from "react";
import { useAuth } from "@/hooks";
import { useUser } from "@/context/SessionContext";

import { Button, InputField } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";


interface CreateMagicSessionProps {

}


const CreateMagicSession: FC<CreateMagicSessionProps> = () => {

    // Hooks
    //
    const { magicLogin, magicForm, setMagicForm } = useAuth();
    const { isLoading } = useUser();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
        setMagicForm({ ...magicForm, [e.target.id]: e.target.value })
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // await login(loginForm.email, loginForm.password);
        await magicLogin(magicForm.email)
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