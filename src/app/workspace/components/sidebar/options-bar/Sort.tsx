'use client';

// React
import { Dispatch, FC, SetStateAction } from "react";

// Typings
import { SnippetLanguage } from "@/types/typings";

// Components
import { Button, Select } from "@/components";

// Icons
import { TbAdjustmentsHorizontal, TbAdjustmentsOff, TbX } from 'react-icons/tb';

// Data
import { languages } from "@/data/languages";


/**
 * SORT BY DATE
 * 
 */
interface SortByDateProps {
    setSortDate: Dispatch<SetStateAction<string>>
}

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
interface SortByTypeProps {
    sortType: string;
    setSortType: Dispatch<SetStateAction<string>>
}

const SortByType: FC<SortByTypeProps> = ({ sortType, setSortType }) => {
    return (
        <Select
            // defaultValue={sortType}
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
interface SortByLanguageProps {
    setSortLanguage: Dispatch<SetStateAction<string>>
}

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
 * 
 */
interface SortProps {
    sortActive: boolean;
    setSortActive: Dispatch<SetStateAction<boolean>>;

    sortDate: string;
    setSortDate: Dispatch<SetStateAction<string>>;
    sortType: string;
    setSortType: Dispatch<SetStateAction<string>>;
    sortLanguage: string;
    setSortLanguage: Dispatch<SetStateAction<string>>;

}

const Sort: FC<SortProps> = ({
    sortActive,
    setSortActive,

    sortDate,
    setSortDate,

    sortType,
    setSortType,

    sortLanguage,
    setSortLanguage
}) => {

    const onReset = () => {
        setSortDate("latest");
        setSortType("all");
        setSortLanguage("all");
        setSortActive(!sortActive)
    }

    return (
        <div className={`${sortActive ? 'py-3 w-full flex' : ''}`}>
            {sortActive &&
                <div className="flex-1 pr-2 flex flex-col gap-2">
                    <SortByDate setSortDate={setSortDate} />
                    <SortByType sortType={sortType} setSortType={setSortType} />
                    {sortType === "code" &&
                        <SortByLanguage setSortLanguage={setSortLanguage} />
                    }
                </div>
            }

            <Button onClick={() => setSortActive(!sortActive)} variant='gray' size='square'>
                {!sortActive && <TbAdjustmentsHorizontal size={20} strokeWidth={1} />}
                {sortActive && <TbX size={20} strokeWidth={1} />}
                {!sortActive && (sortDate !== "latest" || sortType !== "all" || sortLanguage !== "all") &&
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-90"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary opacity-30"></span>
                    </span>
                }
            </Button>
            {sortActive &&
                <Button onClick={onReset} variant='danger' className="ml-2">
                    Clear
                </Button>
            }
        </div>
    );
}

export default Sort;