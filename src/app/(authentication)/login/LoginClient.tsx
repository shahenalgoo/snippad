'use client';

import { useUser } from "@/context/SessionContext";
import useAuth from "@/hooks/appwrite/useAuth";

import { Button, Separator } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";

import CreateOauthSession from "../components/CreateOauthSession";
import CreateMagicSession from "../components/CreateMagicSession";

const LoginClient = () => {

    const { isLoggedIn } = useUser();
    const { logout } = useAuth();

    return (
        <div className="w-full sm:w-96">
            {!isLoggedIn &&
                <>
                    <h1 className="mb-2 text-3xl">Sign In</h1>
                    <p className="mb-6 text-sm">Signing in with Github is recommended to unlock developer-friendly features.</p>

                    <CreateOauthSession />

                    <Separator />

                    <div className="p-4 rounded-xl border border-slate-200">
                        <h4 className="text-md font-bold">Passwordless Login</h4>
                        <p className="mb-4 text-sm">Enter your email address and check your inbox.</p>
                        <CreateMagicSession />
                    </div>
                </>
            }

            {isLoggedIn &&
                <>
                    <h1 className="mb-4 text-xl text-center text-slate-400">Already Logged In!</h1>
                    <div className="flex justify-center gap-2">
                        <Button onClick={logout} variant='gray'>Logout</Button>
                        <Button href="/workspace">
                            Go to Workspace
                            <TbArrowNarrowRight className="ml-2" />
                        </Button>
                    </div>
                </>
            }
        </div>
    );
}

export default LoginClient;