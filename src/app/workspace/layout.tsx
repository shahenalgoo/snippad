import Sidebar from "../(sidebar)/Sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <>
            <div>
                <Sidebar />
                <main className="relative w-full ml-80">
                    {children}
                </main>
            </div>
        </>
    )
}
