'use client';

// React
import { Dispatch, FC, SetStateAction } from "react";

// Typings
import { SnippetLanguage } from "@/types/typings";

// Components
import { Button, Select } from "@/components";

// Icons
import { TbAdjustmentsHorizontal, TbX } from 'react-icons/tb';

// Data
import { languages } from "@/data/languages";
import { SortDate } from "@/types/enums";

interface SortProps {
    sortActive: boolean;
    setSortActive: Dispatch<SetStateAction<boolean>>;
    setSortDate: Dispatch<SetStateAction<string>>;
    setSortType: Dispatch<SetStateAction<string>>;
    setSortLanguage: Dispatch<SetStateAction<string>>;

}

interface SortByDateProps {
    setSortDate: Dispatch<SetStateAction<string>>
}
interface SortByTypeProps {
    setSortType: Dispatch<SetStateAction<string>>
}
interface SortByLanguageProps {
    setSortLanguage: Dispatch<SetStateAction<string>>
}


/**
 * SORT BY DATE
 * 
 */
const SortByDate: FC<SortByDateProps> = ({ setSortDate }) => {

    return (
        <Select
            onChange={(e) => setSortDate(e.currentTarget.value)}
        >
            <option hidden>by date created</option>
            <option value={"latest"}>Latest</option>
            <option value={"oldest"}>Oldest</option>
        </Select>
    );
}


/**
 * SORT BY TYPE
 * 
 */
const SortByType: FC<SortByTypeProps> = ({ setSortType }) => {
    return (
        <Select
            onChange={(e) => setSortType(e.currentTarget.value)}

        >
            <option hidden>by type</option>
            <option value="all">All</option>
            <option value="note">Note</option>
            <option value="code">Code</option>
        </Select>
    );
}


/**
 * SORT BY LANGUAGE
 * 
 */
const SortByLanguage: FC<SortByLanguageProps> = ({ setSortLanguage }) => {

    return (
        <Select
            onChange={(e) => setSortLanguage(e.currentTarget.value)}
        >
            <option hidden>by language</option>
            <option value="all">All</option>
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
    setSortActive,
    setSortDate,
    setSortType,
    setSortLanguage
}) => {

    return (
        <div className={`${sortActive ? 'py-2 w-full flex' : ''}`}>
            {sortActive &&
                <div className="flex-1 pr-2 flex flex-col gap-2">
                    <SortByDate setSortDate={setSortDate} />
                    <SortByType setSortType={setSortType} />
                    <SortByLanguage setSortLanguage={setSortLanguage} />
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