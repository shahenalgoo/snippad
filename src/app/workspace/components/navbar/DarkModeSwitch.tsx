// React
import { FC } from "react";

// Utils
import { useGlobalState, setGlobalState } from "@/utils/global-states";

// Icons
import { TbToggleLeft, TbToggleRight } from "react-icons/tb";


interface DarkModeSwitchProps {

}

const DarkModeSwitch: FC<DarkModeSwitchProps> = () => {

    // States
    //
    const [darkMode] = useGlobalState("darkMode");


    // Handle Dark Mode
    const onToggle = () => {
        setGlobalState("darkMode", !darkMode);
        localStorage.setItem('dark-mode', JSON.stringify(!darkMode ? true : false))
    }

    return (
        <button onClick={onToggle} className="py-1 px-4 w-full flex justify-between items-center">
            <span>Light / Dark</span>
            {!darkMode && <TbToggleLeft size={28} strokeWidth={1} className="text-neutral-400" />}
            {darkMode && <TbToggleRight size={28} strokeWidth={1} className="text-success" />}
        </button>
    );
}

export default DarkModeSwitch;