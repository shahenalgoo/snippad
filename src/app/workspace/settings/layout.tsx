import { Title } from "@/components"
import TabsMenu from "./TabsMenu"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="pt-20 pb-10">
            <Title type="h1">Settings</Title>

            <div className="sm:flex">
                <TabsMenu />

                <div className="flex-1 relative sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
