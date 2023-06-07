'use client';

// React
import { FC } from "react";

// Components
import { Button } from "@/components";

// Icons
import { TbSearch } from 'react-icons/tb';

interface SearchProps {
    className?: string
}

const Search: FC<SearchProps> = ({ className }) => {
    return (
        // <Button variant='link' className={`px-2 border border-border-light justify-start ${className}`}>
        //     <TbSearch size={20} strokeWidth={1} className="mr-2" />
        //     Search...
        // </Button>

        <Button variant='gray' size='square'>
            <TbSearch size={20} strokeWidth={1} />
        </Button>
    );
}

export default Search;