/**
 * A context to handle user sessions from appwrite
 * Also contains the useUser hook to access user data and states
 * 
 */

import React, { createContext, useState, useEffect, useContext } from "react";

import { account } from "@/lib/appwrite-config";
import { Models } from "appwrite";


// Session typings
//
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


// Create new context
//
const SessionContext = createContext<SessionContextType | null>(null);


// Hook to access context
//
export const useUser = (): SessionContextType => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('Hook must be used within an SessionProvider');
    }

    return context;
};


/**
 * Session Provider
 * Wrap application to provide context
 * 
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({ children }: any) => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    // const [session, setSession] = useState<Models.Session | null>(null);


    // Fetch User
    //
    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const promise = await account.get();
            setIsLoggedIn(true);
            setUser(promise);
        } catch (error) {
            console.log("PLEASE LOG IN TO CONTINUE.");
            console.log(error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }


    // Use effect
    //
    useEffect(() => {
        fetchUser();
    }, []);


    // Variables made available from context
    //
    const contextValue: SessionContextType = {
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
    };


    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    )
}