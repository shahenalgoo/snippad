import React, { createContext, useState, useEffect, useContext } from "react";
import { account } from "@/lib/appwrite-config";


type User = {
    name: string;
};

type SessionContextType = {
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);


    const fetchUser = async () => {

        setIsLoggedIn(true);

        try {
            const promise = await account.get();
            console.log(promise);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchUser();
    }, []);



    const contextValue: SessionContextType = {
        user
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    )
}