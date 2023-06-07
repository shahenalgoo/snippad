'use client';

// React
import { FC } from "react";

// Components
import { Button } from "@/components";

// Icons
import { TbAdjustmentsHorizontal } from 'react-icons/tb';


interface SortProps {

}

const Sort: FC<SortProps> = () => {
    return (
        <Button variant='gray' size='square'>
            <TbAdjustmentsHorizontal size={20} strokeWidth={1} />
        </Button>
    );
}

export default Sort;