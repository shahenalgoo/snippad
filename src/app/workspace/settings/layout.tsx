import { Box, Button } from "@/components";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex py-10">
            <Box className="w-56">
                <Button href="/workspace/settings/notebooks">Notebooks</Button>
            </Box>

            <div className="flex-1 relative md:px-6">
                {children}
            </div>
        </div>
    )
}
