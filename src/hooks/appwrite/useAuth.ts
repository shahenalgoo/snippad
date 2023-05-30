import { useUser } from "@/context/SessionContext";
import { account } from "@/lib/appwrite-config";
import { ID } from "appwrite";

export default function useAuth() {

    const { setUser, setIsLoading, setIsLoggedIn } = useUser();

    /**
     * CREATE ACCOUNT
     * 
     * Create user account with traditional email and password.
     * 
     * @param email example@email.com
     * @param password  set a password
     */
    const createEmailAccount = async (
        email: string,
        password: string
    ) => {

        setIsLoading(true);

        try {
            await account.create(ID.unique(), email, password);

            /// TODO: Create a 'General' Notebook for every new user with a server-side function.

            // Proceed to login
            login(email, password);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };


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

        try {
            const res = await account.createEmailSession(email, password)
            console.log("SESSION DATA:::", res);

            setIsLoggedIn(true);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {

        setIsLoading(true);

        try {
            const res = await account.deleteSession('current');
            setIsLoggedIn(false);
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createEmailAccount,
        login,
        logout
    }
}