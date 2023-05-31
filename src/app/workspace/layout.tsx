import NotebookProvider from "@/components/context/NotebookProvider";
import Sidebar from "../(sidebar)/Sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <>
            <NotebookProvider>
                <div>
                    <Sidebar />
                    <main className="relative w-full ml-80">
                        {children}
                    </main>
                </div>
            </NotebookProvider>
        </>
    )
}
