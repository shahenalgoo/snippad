/**
 * Structure of the account creation page
 * 
 */

'use client';

// React
import { FC } from "react";
import { useSearchParams } from "next/navigation";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

// Components
import { Box, Button, InputField, InputLabel } from "@/components";
import AlreadyLoggedIn from "@/components/misc/AlreadyLoggedIn";

// Icons
import { TbArrowNarrowRight } from "react-icons/tb";


const ResetPasswordClient: FC = () => {

    // Find userId and secret token from url
    //
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    // Hooks
    //
    const { isLoading, setIsLoading, isLoggedIn } = useUser();
    const { resetPassword, resetForm, setResetForm } = useAuth();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetForm({ ...resetForm, [e.target.id]: e.target.value });
    }


    // Recovery failed
    //
    if (!userId || !secret) {
        return (
            <>
                <span className="mb-4 text-slate-500">Password recovery failed.</span>
                <Button href="/reset-password">
                    Try again
                </Button>
            </>
        )
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await resetPassword(userId, secret, resetForm.password, resetForm.passwordAgain)
    }


    return !isLoggedIn ? (
        <div className="w-full sm:w-96">

            <h1 className="mb-8 text-3xl text-center">Reset Password</h1>

            <Box variant='border' className="mb-6">
                <form onSubmit={onSubmit}>

                    <div className="mb-6">
                        <InputLabel>Password</InputLabel>
                        <InputField
                            id="password"
                            type='password'
                            defaultValue={resetForm.password}
                            onChange={onFieldChange}
                            disabled={isLoading}
                            className="text-sm disabled:opacity-50"
                        />
                    </div>

                    <div className="mb-6">
                        <InputLabel>Confirm Password</InputLabel>
                        <InputField
                            id="passwordAgain"
                            type='password'
                            defaultValue={resetForm.passwordAgain}
                            onChange={onFieldChange}
                            disabled={isLoading}
                            className="text-sm disabled:opacity-50"
                        />
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full">
                        Set New Password <TbArrowNarrowRight size={20} strokeWidth={1.5} className="ml-2" />
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

export default ResetPasswordClient;