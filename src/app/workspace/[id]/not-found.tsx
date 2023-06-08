import { TbCactus, TbError404 } from "react-icons/tb";

const NotFound = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="mb-4 w-20 h-20 rounded-full flex justify-center items-center bg-slate-100 text-slate-500">
                <TbError404 size={50} strokeWidth={0.5} />
            </div>
            <span className="text-slate-600">Not Found</span>
        </div>
    );
}

export default NotFound;