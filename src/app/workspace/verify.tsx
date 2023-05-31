'use client';

import { FC } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/context/SessionContext";

import { Spinner } from "@/components";
import LoadingComponent from "@/components/misc/Loading";


interface VerifyUserStateProps {
    children: any
}

const VerifyUserState: FC<VerifyUserStateProps> = ({ children }) => {

    const { isLoading, isLoggedIn } = useUser();

    if (!isLoading) {
        if (!isLoggedIn) {
            redirect('/login');
        }
    }

    return (
        <>
            {isLoading && <LoadingComponent />}

            {!isLoading && { children }}
        </>
    )
}

export default VerifyUserState;