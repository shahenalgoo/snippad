import { useState } from "react";
import { useUser } from "@/context/SessionContext";

import { account } from "@/lib/appwrite-config";
import { ID } from "appwrite";

import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";


/// TODO: Create a 'General' Notebook for every new user with a server-side function.


type MagicForm = {
    email: string;
}

type LoginForm = {
    email: string;
    password: string;
}

type CreateAccountForm = {
    name: string;
    email: string;
    password: string;
}


export default function useAuth() {

    // User hook
    //
    const { setUser, setIsLoading, setIsLoggedIn } = useUser();


    // Magic Form State
    //
    const [magicForm, setMagicForm] = useState<MagicForm>({
        email: 'shahenalgoo@gmail.com'
    });


    // Login Form State
    //
    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: 'email32@example.com',
        password: '12345678'
    });


    // Create Account Form State
    //
    const [createAccountForm, setCreateAccountForm] = useState<CreateAccountForm>({
        name: 'Shahen',
        email: 'email44@example.com',
        password: '12345678'
    });



    /**
     * CREATE ACCOUNT
     * 
     * Create user account with traditional email and password.
     * 
     * @param email example@email.com
     * @param password  set a password
     */
    const createAccount = async (
        email: string,
        password: string,
        name?: string
    ) => {

        const res = await account.create(ID.unique(), email, password, name);
        return res;

    };



    const magicLogin = async (
        email: string
    ) => {

        setIsLoading(true);

        try {
            await account.createMagicURLSession(ID.unique(), email, 'http://localhost:3000/confirm-magic-session');
            toast.success('Verification email sent!');
        } catch (error) {
            console.log(error);
            toast.error('Unable to send verification email.');
        } finally {
            setIsLoading(false);
        }
    }



    /**
     * LOGIN
     * 
     * Log user in with traditional email and passowrd.
     * 
     * @param email Email address
     * @param password Password
     */
    const login = async (
        email: string,
        password: string
    ) => {

        setIsLoading(true);
        toast.loading('Logging in...');

        try {
            await account.createEmailSession(email, password);
            setIsLoggedIn(true);
            toast.dismiss();
            toast.success('You are logged in!');
        } catch (error) {
            setIsLoggedIn(false);
            toast.dismiss();
            toast.error('Unable to log in.');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };


    /**
     * LOGOUT
     * 
     */
    const logout = async () => {

        setIsLoading(true);
        toast.loading('Logging in...');

        try {
            await account.deleteSession('current');
            setIsLoggedIn(false);
            setUser(null);
            toast.dismiss();
            toast.success('You logged out!');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createAccount, createAccountForm, setCreateAccountForm,
        magicLogin, magicForm, setMagicForm,
        login, loginForm, setLoginForm,
        logout
    }
}