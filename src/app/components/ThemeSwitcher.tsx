'use client';

import { FC, useEffect } from "react";

interface ThemeSwitcherProps {

}

const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {



    const switchTheme = (e: any) => {

        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');


    }

    // localStorage.setItem('notebookActive', id)

    return (
        <>
            <div className="flex gap-6 p-6">
                <button onClick={switchTheme}>light</button>
                <button onClick={switchTheme}>dark</button>
                <button onClick={switchTheme}>coffee</button>
            </div>
        </>
    );
}

export default ThemeSwitcher;