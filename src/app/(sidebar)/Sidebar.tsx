import NotebookSwitcher from "./components/NotebookSwitcher";
import NotesTest from "../workspace/components/NotesTest";
import NotebookTest from "../workspace/components/NotebookTest";

const Sidebar = () => {

    return (
        <aside className={`fixed top-0 left-0 z-40 w-80 h-full border-r border-border-color bg-background`}>

            <NotebookSwitcher />

            <NotebookTest />
            <NotesTest />
        </aside>
    );
}

export default Sidebar;