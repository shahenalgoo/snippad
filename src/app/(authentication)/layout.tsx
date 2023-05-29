export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <>
            <div>
                <main className="relative w-full">
                    <p>auth layout</p>
                    {children}
                </main>
            </div>
        </>
    )
}
