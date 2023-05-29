/**
 * Switch between different themes
 * 
 */

'use client';

import { FC, useEffect, useState } from "react";
import Cookies from 'universal-cookie';

interface ThemeSwitcherProps {

}

interface Theme {
    name: string,
    ref: string
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {

    // Initialize themes variables
    const themesList = [
        {
            name: "Light",
            ref: "theme-light"
        },
        {
            name: "Dark",
            ref: "theme-dark"
        },
        {
            name: "Coffee",
            ref: "theme-coffee"
        }
    ] as Theme[];

    const defaultTheme = themesList[0];
    const [theme, setTheme] = useState<string>(defaultTheme.ref);

    // Initialize cookie
    const cookies = new Cookies();
    const themeCookieRef = 'themeActive';

    // Switch between themes
    const handleSwitchTheme = (currentTheme: string) => {
        if (theme === currentTheme) return;
        updateTheme(currentTheme);
        cookies.set(themeCookieRef, currentTheme);
    }

    // Update body class and set new theme state
    function updateTheme(currentTheme: string) {
        document.body.classList.remove(theme);
        document.body.classList.add(currentTheme);
        setTheme(currentTheme);
    }

    useEffect(() => {
        // Fetch saved theme from cookies
        const savedThemeRef = cookies.get(themeCookieRef);

        // If not found, save the default theme in cookies. Else, replace default theme.
        if (!savedThemeRef) {
            cookies.set(themeCookieRef, defaultTheme.ref);
        } else {
            updateTheme(savedThemeRef);
        }

    }, []);

    return (
        <>
            <div className="flex gap-6 p-6">
                <button onClick={() => handleSwitchTheme(defaultTheme.ref)}>{defaultTheme.name}</button>
                <button onClick={() => handleSwitchTheme(themesList[1].ref)}>{themesList[1].name}</button>
                <button onClick={() => handleSwitchTheme(themesList[2].ref)}>{themesList[2].name}</button>

            </div>
        </>
    );
}
export default ThemeSwitcher;