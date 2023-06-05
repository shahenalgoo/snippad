import { FC } from "react";
import Spinner from "../ui/Spinner";

interface LoadingComponentProps {
    className?: string;
    loadingMessage?: string;
}

const LoadingComponent: FC<LoadingComponentProps> = ({ className, loadingMessage }) => {
    return (
        <div className={`w-full h-full flex flex-col justify-center items-center ${className}`}>
            <Spinner size='lg' className="mb-4" />
            {/* <span className="text-sm text-slate-500">{loadingMessage || 'Loading...'}</span> */}
        </div>
    );
}

export default LoadingComponent;