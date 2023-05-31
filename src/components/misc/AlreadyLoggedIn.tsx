'use client';

import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

import Button from "../ui/Button";
import { TbArrowNarrowRight } from "react-icons/tb";

const AlreadyLoggedIn = () => {

    // Hooks
    //
    const { isLoading, user } = useUser();
    const { logout } = useAuth();


    return (
        <>
            <h1 className="mb-0 text-xl text-center">You are logged in!</h1>
            <p className="mb-6 text-sm text-center text-slate-500">{!isLoading && user?.email}</p>

            <div className="flex justify-center gap-2">
                <Button onClick={logout} variant='gray'>Logout</Button>
                <Button href="/workspace">
                    Go to Workspace
                    <TbArrowNarrowRight className="ml-2" />
                </Button>
            </div>
        </>
    );
}

export default AlreadyLoggedIn;