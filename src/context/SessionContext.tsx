import React, { createContext, useState, useEffect, useContext } from "react";
import { account } from "@/lib/appwrite-config";
import { Models } from "appwrite";


// type User = {
//     name: string;
// };

type SessionContextType = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: Models.User<Models.Preferences> | null;
    setUser: React.Dispatch<React.SetStateAction<Models.User<Models.Preferences> | null>>;
    //session: Models.Session | null;
    //setSession: React.Dispatch<React.SetStateAction<Models.Session | null>>;
};

type SessionProviderProps = {
    children: React.ReactNode;
};

const SessionContext = createContext<SessionContextType | null>(null);
export const useUser = (): SessionContextType => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('Hook must be used within an SessionProvider');
    }

    return context;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }: any) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    // const [session, setSession] = useState<Models.Session | null>(null);


    const fetchUser = async () => {

        setIsLoading(true);

        try {
            const promise = await account.get();
            console.log(promise);
            setUser(promise);
        } catch (error) {
            console.log(error);
            console.log("PLEASE LOG IN TO CONTINUE");
            setUser(null);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchUser();
    }, []);



    const contextValue: SessionContextType = {
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        //session,
        //setSession
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    )
}