'use client';

import React, { FC } from "react";
import { useGlobalState } from '@/utils/global-states';

interface BodyWrapProps {
    children: React.ReactNode;
}

const BodyWrap: FC<BodyWrapProps> = ({ children }) => {

    const [sidebar] = useGlobalState("sidebar");
    const [searchModal] = useGlobalState("searchModal");

    return (
        <html lang="en" className='!min-h-full h-full'>
            <body className={`relative !min-h-full h-full ${searchModal || sidebar ? 'overflow-hidden' : ''}`}>
                {children}
            </body>
        </html>
    );
}

export default BodyWrap;