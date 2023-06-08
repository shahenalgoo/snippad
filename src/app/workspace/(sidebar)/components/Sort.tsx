'use client';

// React
import { Dispatch, FC, SetStateAction } from "react";

// Typings
import { SnippetLanguage } from "@/types/typings";

// Components
import { Button, InputLabel, Select } from "@/components";

// Icons
import { TbAdjustmentsHorizontal, TbChevronDown, TbX } from 'react-icons/tb';

// Data
import { languages } from "@/data/languages";

interface SortProps {
    sortActive: boolean;
    setSortActive: Dispatch<SetStateAction<boolean>>
}

interface SortByDateProps { }
interface SortByTypeProps { }
interface SortByLanguageProps { }


/**
 * SORT BY DATE
 * 
 */
const SortByDate: FC<SortByDateProps> = () => {
    return (
        <Select
        >
            <option hidden>by date created</option>
            <option value="">Latest</option>
            <option value="">Oldest</option>
        </Select>
    );
}


/**
 * SORT BY TYPE
 * 
 */
const SortByType: FC<SortByTypeProps> = () => {
    return (
        <Select
        >
            <option hidden>by type</option>
            <option value="">Note</option>
            <option value="">Code</option>
        </Select>
    );
}


/**
 * SORT BY LANGUAGE
 * 
 */
const SortByLanguage: FC<SortByLanguageProps> = () => {
    return (
        <Select>
            <option hidden>by language</option>
            {languages.map((language: SnippetLanguage, i) => (
                <option key={i} value={language.alias}>{language.name}</option>
            ))}
        </Select>
    );
}


/**
 * EXPORTED PARENT COMPONENT
 */
const Sort: FC<SortProps> = ({
    sortActive,
    setSortActive
}) => {

    return (
        <div className={`${sortActive ? 'py-2 w-full flex' : ''}`}>
            {sortActive &&
                <div className="flex-1 pr-2 flex flex-col gap-2">
                    <SortByDate />
                    <SortByType />
                    <SortByLanguage />
                </div>
            }

            <Button onClick={() => setSortActive(!sortActive)} variant='gray' size='square'>
                {!sortActive && <TbAdjustmentsHorizontal size={20} strokeWidth={1} />}
                {sortActive && <TbX size={20} strokeWidth={1} />}
            </Button>
        </div>
    );
}

export default Sort;