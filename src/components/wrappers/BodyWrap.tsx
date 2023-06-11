/**
 * Main Body Wrap for primary layout
 * 
 */

'use client';

// React
import React, { FC } from "react";

// Utils
import { useGlobalState } from '@/utils/global-states';

interface BodyWrapProps {
    children: React.ReactNode;
}

const BodyWrap: FC<BodyWrapProps> = ({ children }) => {

    // States
    //
    const [sidebar] = useGlobalState("sidebar");
    const [searchModal] = useGlobalState("searchModal");

    return (
        <html lang="en" className='!min-h-full h-full'>

            {/* ~ If search modal or sidebar is open, set body to overflow-hidden */}
            <body className={`relative !min-h-full h-full ${searchModal || sidebar ? 'overflow-hidden' : ''}`}>
                {children}
            </body>
        </html>
    );
}

export default BodyWrap;