'use client';

import { FC, useState } from "react";
import { account } from "@/lib/appwrite-config";

import { Button, InputField, InputLabel } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";
import { toast } from "react-hot-toast";

interface CreateEmailSessionProps {

}

type FormData = {
    email: string;
    password: string;
}

const CreateEmailSession: FC<CreateEmailSessionProps> = () => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form, setForm] = useState<FormData>({
        email: 'email32@example.com',
        password: '12345678'
    });


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        toast.loading('Signing in...');

        try {
            await account.createEmailSession(form.email, form.password);
            toast.dismiss();
            toast.success('You are signed in!');
        } catch (error) {
            toast.dismiss();
            toast.error('Unable to sign in.');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="w-full md:w-96">
            <div className="mb-6">
                <InputLabel>Email Address</InputLabel>
                <InputField
                    id="email"
                    type='email'
                    defaultValue={form.email}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <div className="mb-4">
                <InputLabel>Password</InputLabel>
                <InputField
                    id="password"
                    type='password'
                    defaultValue={form.password}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <Button type="submit" className="mt-2">
                Sign In <TbArrowNarrowRight size={20} strokeWidth={1.5} className="ml-2" />
            </Button>

        </form>
    );
}

export default CreateEmailSession;