import NotebookProvider from "@/components/context/NotebookProvider";
import VerifyUserState from "./verify";
import Sidebar from "../(sidebar)/Sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <NotebookProvider>
                <VerifyUserState>

                    {/* @ts-ignore */}
                    <Sidebar />

                    <main className="relative w-auto ml-80">
                        {children}
                    </main>

                </VerifyUserState>
            </NotebookProvider>
        </>
    )
}
