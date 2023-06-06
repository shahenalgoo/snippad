'use client';

// React
import { FC } from "react";
import { usePathname, useRouter } from 'next/navigation';

// Components
import { Button } from "@/components";

// Icons
import { TbPlus } from 'react-icons/tb';

interface CreateNewProps {

}

const CreateNew: FC<CreateNewProps> = () => {

    // Hooks
    //
    const pathname = usePathname();
    const router = useRouter();


    return (
        <Button onClick={() => router.push('/workspace')} disabled={pathname === '/workspace'} size='square' className="disabled:bg-slate-100">
            <TbPlus size={20} strokeWidth={1.5} />
        </Button>
    );
}

export default CreateNew;