/**
 * The account verifier checks if wherever the user is logged in or not and performs redirects accordingly.
 * 
 */

'use client';

import { redirect } from "next/navigation";
import { useUser } from '@/context/SessionContext';

const AccountVerifier = () => {

    // Fetch user data from hook
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn && !user) {
        redirect('/login')
    } else {
        redirect('/workspace')
    }

}

export default AccountVerifier;