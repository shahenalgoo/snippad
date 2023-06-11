/**
 * In case a user is already logged in
 * 
 */

'use client';

// Hooks
import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

// Components
import Button from "../ui/Button";

// Icons
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

                {/* Used anchor tag insteaf of Link as a quickfix for useEffects not firing when 're-routing' to workspace */}
                <a href="/workspace" className="relative inline-flex justify-center items-center shrink-0 font-sans font-semibold transition-all outline-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-black hover:bg-neutral-950 text-white h-10 px-4 text-sm rounded-lg">
                    Go to Workspace
                    <TbArrowNarrowRight className="ml-2" />
                </a>
            </div>
        </>
    );
}

export default AlreadyLoggedIn;