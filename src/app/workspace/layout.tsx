import NotebookProvider from "@/components/context/NotebookProvider";
import VerifyUserState from "./verify";
import WorkspaceSidebar from "./(sidebar)/WorkspaceSidebar";
import WorkspaceHeader from "./(header-mobile)/Header";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <NotebookProvider>
                <VerifyUserState>

                    <WorkspaceHeader />
                    <WorkspaceSidebar />

                    <main className="relative !min-h-full h-full lg:ml-80 xl:ml-96 transition-all">
                        <div className="!min-h-full h-full w-full md:w-[700px] xl:w-[800px] 2xl:w-[900px] mt-20 lg:mt-0 md:mx-auto px-6">
                            {children}
                        </div>
                    </main>

                </VerifyUserState>
            </NotebookProvider>
        </>
    )
}
