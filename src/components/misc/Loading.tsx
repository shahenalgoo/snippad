/**
 * General loading with flexbox parent to fill viewport or spaces
 * 
 */

// React
import { FC } from "react";

// Components
import Spinner from "../ui/Spinner";

interface LoadingComponentProps {
    className?: string;
    loadingMessage?: string;
}

const LoadingComponent: FC<LoadingComponentProps> = ({ className, loadingMessage }) => {
    return (
        <div className={`w-full h-full flex flex-col justify-center items-center ${className}`}>
            <Spinner size='lg' className="mb-4" />
        </div>
    );
}

export default LoadingComponent;