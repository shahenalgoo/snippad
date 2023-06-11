/**
 * Structure of the account creation page
 * 
 */

'use client';

// React
import { FC } from "react";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

// Components
import { Box, Button, InputField } from "@/components";
import AlreadyLoggedIn from "@/components/misc/AlreadyLoggedIn";

// Icons
import { TbArrowNarrowRight } from "react-icons/tb";


const RecoverPasswordClient: FC = () => {

    // Hooks
    //
    const { isLoading, setIsLoading, isLoggedIn } = useUser();
    const { recoverPassword, recoverForm, setRecoverForm, } = useAuth();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecoverForm({ ...recoverForm, email: e.target.value });
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await recoverPassword(recoverForm.email, `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`)
    }


    return !isLoggedIn ? (
        <div className="w-full sm:w-96">

            <h1 className="mb-8 text-3xl text-center">Recover Password</h1>

            <Box variant='border' className="mb-6">
                <form onSubmit={onSubmit} className="flex gap-2">

                    <InputField
                        id="email"
                        type='email'
                        defaultValue={recoverForm.email}
                        onChange={onFieldChange}
                        disabled={isLoading}
                        placeholder="Your email here..."
                    />

                    <Button type="submit" className="w-10 p-0">
                        <TbArrowNarrowRight size={20} strokeWidth={1.5} />
                    </Button>

                </form>
            </Box>

            <div className="flex justify-center gap-4">
                <Button href="/login" variant='link'>
                    Sign In
                </Button>
            </div>

        </div>
    ) : <AlreadyLoggedIn />
}

export default RecoverPasswordClient;