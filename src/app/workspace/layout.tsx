/**
 * The main layout structure of the workspace
 * - Contains a notebook context to tract the active notebook data across the app
 * - Contains a user verification wrapper to perform redirects based on user states
 * - Contains workspace sidebar and mobile header
 * 
 */

// Wrappers
import NotebookProvider from "@/components/wrappers/NotebookProvider";
import VerifyUserState from "./verify";

// Workspace components
import HeaderMobile from "./(headers)/HeaderMobile";
import Sidebar from "./(sidebar)/Sidebar";

// Modals
import SearchModal from "./(search-modal)/SearchModal";


export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <NotebookProvider>
                <VerifyUserState>

                    {/* Mobile header */}
                    <HeaderMobile />

                    {/* Workspace Sidebar */}
                    <Sidebar />

                    {/* Workspace Content */}
                    <main className="relative !min-h-full h-full lg:ml-80 xl:ml-96 transition-all">
                        <div className="!min-h-full h-full w-full md:w-[700px] xl:w-[800px] 2xl:w-[900px] md:mx-auto px-6">
                            {children}
                        </div>
                    </main>

                    {/* Search Modal */}
                    <SearchModal />

                </VerifyUserState>
            </NotebookProvider>
        </>
    )
}
