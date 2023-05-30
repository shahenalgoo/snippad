export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <main className="p-6 min-h-screen w-full relative flex flex-col justify-center items-center">
            {children}
        </main>
    )
}
