'use client';

import { FC } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { account } from "@/lib/appwrite-config";

import { Button, Separator, Spinner } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/SessionContext";


interface ConfirmMagicClientProps {

}


const ConfirmMagicClient: FC<ConfirmMagicClientProps> = () => {

    // Find userId and secret token from url
    //
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    // Init router
    //
    const router = useRouter();

    const { setIsLoading, setIsLoggedIn } = useUser();


    const handleConfirmation = async () => {

        setIsLoading(true);
        toast.loading('Logging in...');

        try {
            await account.updateMagicURLSession(userId || "", secret || "");
            setIsLoggedIn(true);
            toast.dismiss();
            toast.success('You are logged in!');
            router.push('/workspace');
        } catch (error) {
            setIsLoggedIn(false);
            toast.dismiss();
            toast.error('Unable to log in.');
            console.log(error);
        } finally {
            setIsLoading(true);
        }

    }


    if (!userId || !secret) {
        return (
            <>
                <span className="mb-4 text-slate-500">Confirmation failed.</span>
                <Button href="/login">
                    Try again
                </Button>
            </>
        )
    }

    return (
        <>
            <Spinner size='lg' className="mb-4" />
            <span className="mb-8 text-sm text-slate-500">Awaiting user confirmation.</span>

            {/* <Separator /> */}

            <div className="flex justify-center gap-2">
                <Button onClick={handleConfirmation}>
                    Confirm to log in
                    <TbArrowNarrowRight className="ml-2" />
                </Button>
            </div>
        </>
    );
}

export default ConfirmMagicClient;