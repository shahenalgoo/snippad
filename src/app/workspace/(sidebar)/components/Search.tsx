'use client';

// React
import { Dispatch, FC, SetStateAction, useRef, useEffect } from "react";

// Components
import { Button } from "@/components";

// Icons
import { TbSearch, TbX } from 'react-icons/tb';

interface SearchProps {
    className?: string;
    searchActive: boolean;
    setSearchActive: Dispatch<SetStateAction<boolean>>
}

const Search: FC<SearchProps> = ({
    className,
    searchActive,
    setSearchActive
}) => {

    // Ref
    const ref = useRef<any>(null);

    useEffect(() => {

        // Autofocus on field
        if (ref && ref.current && searchActive === true) {
            ref.current.focus();
        }
    }, [searchActive, ref]);

    return (
        <>
            {searchActive &&
                <form className="flex-1 h-full flex items-center">
                    <input
                        ref={ref}
                        type="text"
                        placeholder="Type and hit enter to search..."
                        className="w-full h-full outline-none font-semibold placeholder:text-sm placeholder:font-normal"
                    />
                    {/* 
                    <Button type="submit" variant='primary' size='square'>
                        <TbSearch size={20} strokeWidth={1} />
                    </Button> */}
                </form>
            }

            <Button onClick={() => setSearchActive(!searchActive)} variant='gray' size='square'>
                {!searchActive && <TbSearch size={20} strokeWidth={1} />}
                {searchActive && <TbX size={20} strokeWidth={1} />}
            </Button>
        </>
    );
}

export default Search;