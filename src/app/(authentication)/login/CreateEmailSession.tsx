/**
 * TRADITIONAL LOGIN
 * 
 */

'use client';

// React
import { FC } from "react";

// Hooks
import { useAuth } from "@/hooks";
import { useUser } from "@/context/SessionContext";

// Components
import { Button, InputField, InputLabel } from "@/components";

// Icons
import { TbArrowNarrowRight } from "react-icons/tb";


const CreateEmailSession: FC = () => {

    // Hooks
    //
    const { login, loginForm, setLoginForm } = useAuth();
    const { isLoading } = useUser();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(loginForm.email, loginForm.password);
    }


    return (
        <form onSubmit={onSubmit}>

            <div className="mb-6">
                <InputLabel>Email Address</InputLabel>
                <InputField
                    id="email"
                    type='email'
                    defaultValue={loginForm.email}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <div className="mb-6">
                <InputLabel>Password</InputLabel>
                <InputField
                    id="password"
                    type='password'
                    defaultValue={loginForm.password}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <Button type="submit" className="w-full">
                Sign In <TbArrowNarrowRight size={20} strokeWidth={1.5} className="ml-2" />
            </Button>

        </form>
    );
}

export default CreateEmailSession;