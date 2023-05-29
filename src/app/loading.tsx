import { Spinner } from "@/components";

const Loading = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Spinner size='lg' className="mb-4" />
            <span className="text-sm text-neutral-500">Loading Note...</span>
        </div>
    );
}

export default Loading;