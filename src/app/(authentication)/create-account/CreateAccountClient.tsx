'use client';

import { useUser } from "@/context/SessionContext";

import { Box, Button } from "@/components";

import CreateAccount from "../components/CreateAccount";
import AlreadyLoggedIn from "@/components/misc/AlreadyLoggedIn";

const CreateAccountClient = () => {

    // Hooks
    //
    const { isLoading, isLoggedIn } = useUser();


    return (
        <div className="w-full sm:w-96">

            {!isLoading && isLoggedIn && <AlreadyLoggedIn />}

            {!isLoggedIn &&
                <>
                    <h1 className="mb-8 text-3xl text-center">Create Account</h1>

                    <Box variant='border' className="mb-6">
                        <CreateAccount />
                    </Box>

                    <div className="flex justify-center gap-4">
                        <Button href="/login" variant='link'>
                            Sign In
                        </Button>
                    </div>
                </>
            }

        </div>
    );
}

export default CreateAccountClient;