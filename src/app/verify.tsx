/**
 * The account verifier checks if wherever the user is logged in or not and performs redirects accordingly.
 * 
 */

'use client';

import { redirect } from "next/navigation";
import { useUser } from '@/context/SessionContext';
import { Spinner } from "@/components";

const VerifyUserState = () => {

    // Fetch user data from hook
    //
    const { isLoading, isLoggedIn } = useUser();


    // Redirects based on user's state
    //
    if (!isLoading) {
        if (!isLoggedIn) {
            redirect('/login')
        } else {
            redirect('/workspace')
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Spinner size='lg' className="mb-4" />
            <span className="text-sm text-slate-500">Verifying user...</span>
        </div>
    )
}

export default VerifyUserState;