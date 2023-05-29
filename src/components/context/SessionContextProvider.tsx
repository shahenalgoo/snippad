'use client';
import { SessionProvider } from '@/context/SessionContext';

const SessionContextProvider = ({ children }: any) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default SessionContextProvider;