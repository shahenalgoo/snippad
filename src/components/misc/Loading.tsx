import { FC } from "react";
import Spinner from "../ui/Spinner";

interface LoadingComponentProps {
    loadingMessage?: string;
}

const LoadingComponent: FC<LoadingComponentProps> = ({ loadingMessage }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Spinner size='lg' className="mb-4" />
            <span className="text-sm text-slate-500">{loadingMessage || 'Loading...'}</span>
        </div>
    );
}

export default LoadingComponent;