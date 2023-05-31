import Sidebar from "../(sidebar)/Sidebar";
import VerifyUserState from "./verify";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <VerifyUserState>
                <Sidebar />
                <main className="relative w-auto ml-80">
                    {children}
                </main>
            </VerifyUserState>
        </>
    )
}
