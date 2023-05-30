'use client'
import { useUser } from "@/context/SessionContext";
import useAuth from "@/hooks/appwrite/useAuth";
import { redirect } from "next/navigation";

const Testing = () => {
    const { createEmailAccount, login, logout } = useAuth();
    const { isLoggedIn } = useUser();

    if (isLoggedIn) {
        redirect('/workspace');
    }

    return (
        <div>
            <button className="mx-6" onClick={() => createEmailAccount("test123@gmail.com", "12345678")}>Create Account</button>
            <button className="mx-6" onClick={() => login("test123@gmail.com", "12345678")}>Login</button>
            <button className="mx-6" onClick={logout}>Logout</button>
        </div>
    );
}

export default Testing;