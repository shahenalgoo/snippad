import ThemeSwitcher from "../components/ThemeSwitcher";
import SidebarHeader from "./components/Header";

const Sidebar = () => {

    // const bg_background = "bg-coffee-background"

    return (
        <aside className={`fixed top-0 left-0 z-40 w-[300px] h-full border-r bg-background border-border-default `}>

            <SidebarHeader />
            <ThemeSwitcher />
        </aside>
    );
}

export default Sidebar;