/**
 * A context to handle user sessions from appwrite
 * Also contains the useUser hook to access user data and states
 * 
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

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

    // Fetch User & set login status
    //
    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            //check session first
            const sessionInfo = await account.getSession('current');
            if (!sessionInfo) return;

            console.log('session found');

            setIsLoggedIn(true);
            const userInfo = await account.get();
            setUser(userInfo);
        } catch (error) {
            console.log("PLEASE LOG IN TO CONTINUE.");
            console.log(error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);


    // Use effect
    //
    useEffect(() => {
        console.log('uef fires');

        fetchUser();
    }, [fetchUser]);


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