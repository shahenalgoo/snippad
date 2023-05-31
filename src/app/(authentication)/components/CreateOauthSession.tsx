'use client';

import { FC } from "react";
import { account } from "@/lib/appwrite-config";

import { Button, Grid } from "@/components";
import { TbBrandGithub, TbBrandDiscord, TbBrandGoogle, TbArrowNarrowRight } from "react-icons/tb";


interface CreateOauthSessionProps {

}


const CreateOauthSession: FC<CreateOauthSessionProps> = () => {

    // Sign in with Github
    //
    const handleGithubAuth = async () => {
        try {
            await account.createOAuth2Session(
                'github',
                window.location.origin + "/"
            );
        } catch (error) {
            console.log(error);
        }
    }


    // Sign in with Discord
    //
    const handleDiscordAuth = async () => {
        try {
            await account.createOAuth2Session(
                'discord',
                window.location.origin + "/"
            );
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Grid className="grid-cols-2 gap-3">
                <Button onClick={handleGithubAuth} className="col-span-2 gap-2" variant='github' size='full'>
                    <TbBrandGithub size={24} strokeWidth={1} />
                    <span>Github</span>
                    <TbArrowNarrowRight size={24} strokeWidth={1} />
                </Button>

                <Button onClick={handleDiscordAuth} className="col-span-1 gap-2" variant='gray' size='full'>
                    <TbBrandDiscord size={24} strokeWidth={1} />
                    <span>Discord</span>
                </Button>

                <Button disabled className="col-span-1 gap-2" variant='gray' size='full' title="Not available in demo.">
                    <TbBrandGoogle size={24} strokeWidth={1} />
                    <span>Google</span>
                </Button>
            </Grid >
        </>
    );
}

export default CreateOauthSession;