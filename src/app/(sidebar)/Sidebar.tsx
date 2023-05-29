import ThemeSwitcher from "./components/ThemeSwitcher";
import NotebookSwitcher from "./components/NotebookSwitcher";

const Sidebar = () => {

    return (
        <aside className={`fixed top-0 left-0 z-40 w-80 h-full border-r border-border-color bg-background`}>

            <NotebookSwitcher />


            <ThemeSwitcher />
        </aside>
    );
}

export default Sidebar;