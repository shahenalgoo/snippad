'use client';
import { SessionProvider as SessionContextProvider } from '@/context/SessionContext';

const SessionProvider = ({ children }: any) => {
    return (
        <SessionContextProvider>
            {children}
        </SessionContextProvider>
    );
}

export default SessionProvider;