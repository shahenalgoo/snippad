/**
 * Verify if the user is logged in
 * if not, redirect to the login page
 * This verification component also wraps the children in ./layout
 * 
 */

'use client';

// React
import { FC } from "react";
import { redirect } from "next/navigation";

// Hooks
import { useUser } from "@/context/SessionContext";

// Components
import LoadingComponent from "@/components/misc/Loading";


interface VerifyUserStateProps {
    children: any
}

const VerifyUserState: FC<VerifyUserStateProps> = ({ children }) => {

    // Hooks
    //
    const { isLoading, isLoggedIn } = useUser();


    // Redirect to login if user is logged out
    //
    if (!isLoading) {
        if (!isLoggedIn) {
            redirect('/login');
        }
    }

    return (
        <>
            {/* Show loading component if user is still loading */}
            {isLoading && <LoadingComponent />}

            {/* Wraps workspace */}
            {!isLoading &&
                <>
                    {children}
                </>
            }
        </>
    )
}

export default VerifyUserState;