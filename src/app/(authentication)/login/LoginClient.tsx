/**
 * Structure of the login page
 * Social, Passwordless & traditional login
 * 
 */

'use client';

import { FC } from "react";

import { useUser } from "@/context/SessionContext";
import { useToggle } from "@/hooks";

import { Box, Button, Separator } from "@/components";
import AlreadyLoggedIn from "@/components/misc/AlreadyLoggedIn";

import { TbArrowNarrowRight } from "react-icons/tb";

import CreateOauthSession from "./CreateOauthSession";
import CreateMagicSession from "./CreateMagicSession";
import CreateEmailSession from "./CreateEmailSession";


const LoginClient: FC = () => {

    // Hooks
    //
    const [traditionalLogin, setTraditionalLogin] = useToggle();
    const { isLoggedIn } = useUser();


    return !isLoggedIn ? (
        <div className="w-full sm:w-96">

            <h1 className="mb-2 text-3xl">Sign In</h1>
            <p className="mb-6 text-sm">Sign in to access your workspace.</p>


            {/* Oauth2 & Magic Login */}
            {!traditionalLogin &&
                <>
                    <CreateOauthSession />

                    <Separator />

                    <div className="p-4 rounded-xl border border-slate-200">
                        <h4 className="text-md font-bold">Passwordless Login</h4>
                        <p className="mb-4 text-sm">Enter your email address and check your inbox.</p>

                        <CreateMagicSession />
                    </div>

                    <Separator />
                </>
            }


            {/* Email/Password Login */}
            {traditionalLogin &&
                <>
                    <Box variant='border' className="mb-6">
                        <CreateEmailSession />
                    </Box>

                    <div className="flex justify-center gap-4">
                        <Button href="/create-account" variant='link'>
                            Create Account
                        </Button>
                        <Button href="/recover" variant='link'>
                            Forgot Password?
                        </Button>
                    </div>
                    <Separator />
                </>
            }


            {/* Switch between modern & traditional login */}
            <div className="text-center">
                <Button onClick={setTraditionalLogin} variant='gray'>
                    {!traditionalLogin ? 'Use Email & Password' : 'Use Social & Passwordless Login'}
                    <TbArrowNarrowRight size={18} strokeWidth={2} className="ml-1 mt-[1px]" />
                </Button>
            </div>

        </div>
    ) : <AlreadyLoggedIn />
}

export default LoginClient;