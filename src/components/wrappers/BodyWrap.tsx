/**
 * Main Body Wrap for primary layout
 * 
 */

'use client';

// React
import React, { FC, useCallback, useEffect } from "react";

// Utils
import { setGlobalState, useGlobalState } from '@/utils/global-states';

interface BodyWrapProps {
    children: React.ReactNode;
}

const BodyWrap: FC<BodyWrapProps> = ({ children }) => {

    // States
    //
    const [darkMode] = useGlobalState("darkMode");
    const [sidebar] = useGlobalState("sidebar");
    const [searchModal] = useGlobalState("searchModal");

    const isDarkMode = useCallback(() => {
        const isDarkMode = localStorage.getItem('dark-mode');

        if (isDarkMode === null) {
            localStorage.setItem('dark-mode', "true");
        } else {
            let boolValue = (isDarkMode === "true");
            setGlobalState("darkMode", boolValue)
        }
    }, []);


    useEffect(() => {
        isDarkMode();
    }, [isDarkMode]);

    return (
        <html lang="en" className={`!min-h-full h-full ${darkMode && 'dark'}`}>

            {/* ~ If search modal or sidebar is open, set body to overflow-hidden */}
            <body className={`relative !min-h-full h-full dark:bg-neutral-900 dark:text-white ${searchModal || sidebar ? 'overflow-hidden' : ''} `}>
                {children}
            </body>
        </html>
    );
}

export default BodyWrap;