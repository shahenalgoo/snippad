'use client'

import { FC } from "react";

interface MainFullCenteredProps {
    children: any
}

const MainFullCentered: FC<MainFullCenteredProps> = ({ children }) => {

    return (
        <main className="min-h-screen w-full relative flex flex-col justify-center items-center">
            {children}
        </main>
    );
}

export default MainFullCentered;