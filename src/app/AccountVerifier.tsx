'use client';

import { FC } from "react";
import { Spinner } from "@/components";

import { useUser } from '@/context/SessionContext';

interface AccountVerifierProps {

}

const AccountVerifier: FC<AccountVerifierProps> = () => {

    const { user } = useUser();

    return (
        <>
            <Spinner size='lg' className='mb-4' />
            Verifying user...
        </>
    );
}

export default AccountVerifier;