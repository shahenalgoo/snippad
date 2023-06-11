/**
 * A hook to handle authentication
 * 
 * TODO: Create a 'General' Notebook for every new user with a server-side function.
 * 
*/

// React
import { useState } from "react";
import { useRouter } from "next/navigation";

// Typings
import { MagicForm, LoginForm, CreateAccountForm, RecoverForm, PasswordResetForm } from "@/types/typings";

// Hooks
import { useUser } from "@/context/SessionContext";

// Appwrite
import { account } from "@/lib/appwrite-config";
import { ID } from "appwrite";

// Toast
import { toast } from "react-hot-toast";


export default function useAuth() {

    // User hook
    //
    const { setUser, setIsLoading, setIsLoggedIn } = useUser();
    const router = useRouter();


    // Magic Form State
    //
    const [magicForm, setMagicForm] = useState<MagicForm>({
        email: '',
        url: ''
    });


    // Login Form State
    //
    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: '',
        password: ''
    });


    // Create Account Form State
    //
    const [createAccountForm, setCreateAccountForm] = useState<CreateAccountForm>({
        name: '',
        email: '',
        password: ''
    });


    // Recover Password Form State
    //
    const [recoverForm, setRecoverForm] = useState<RecoverForm>({
        email: '',
        url: ''
    });


    // Reset Password Form State
    //
    const [resetForm, setResetForm] = useState<PasswordResetForm>({
        password: '',
        passwordAgain: ''
    });


    /**
     * CREATE ACCOUNT
     * 
     * Create user account with traditional email and password.
     * 
     * @param email example@email.com
     * @param password  set a password
     * 
     */
    const createAccount = async (
        email: string,
        password: string,
        name?: string
    ) => {

        const res = await account.create(ID.unique(), email, password, name);
        return res;

    };


    /**
     * MAGIC LOGIN
     * 
     * Log user in magically 🧙
     * 
     * @param email email address
     * @param url redirect url
     * 
     */
    const magicLogin = async (
        email: string,
        url: string
    ) => {

        setIsLoading(true);

        try {
            await account.createMagicURLSession(ID.unique(), email, url);
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
     * @param email email address
     * @param password password
     * 
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
        toast.loading('Logging out...');

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


    /**
     * RECOVER PASSWORD
     * 
     * @param email email address
     * @param url redirect url
     * 
     */
    const recoverPassword = async (
        email: string,
        url: string
    ) => {

        setIsLoading(true);

        try {
            await account.createRecovery(email, url);
            toast.success('Verification email sent!');
        } catch (error) {
            console.log(error);
            toast.error('Unable to send verification email.');
        } finally {
            setIsLoading(false);
        }
    }


    /**
     * RECOVER PASSWORD
     * 
     * @param email email address
     * @param url redirect url
     * 
     */
    const resetPassword = async (
        userId: string,
        secret: string,
        password: string,
        passwordAgain: string
    ) => {

        setIsLoading(true);

        try {
            await account.updateRecovery(userId, secret, password, passwordAgain);
            toast.success('New password set, you can now sign in.');
            router.push("/login")
        } catch (error) {
            console.log(error);
            toast.error('Unable to set new password.');
        } finally {
            setIsLoading(false);
        }
    }


    return {
        createAccount, createAccountForm, setCreateAccountForm,
        magicLogin, magicForm, setMagicForm,
        login, loginForm, setLoginForm,
        recoverPassword, recoverForm, setRecoverForm,
        resetPassword, resetForm, setResetForm,
        logout
    }
}