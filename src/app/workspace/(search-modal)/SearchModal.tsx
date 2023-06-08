'use client';

// React
import { Dispatch, FC, FormEventHandler, MouseEventHandler, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

// Typings
import { Note } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Components
import { Button, Grid, Modal, Spinner } from "@/components";
import NoteCard from "../components/NoteCard";

// Icons
import { TbSearch, TbX } from 'react-icons/tb';

// Utils
import { useGlobalState, setGlobalState } from "@/utils/global-states";
import { containsOnlySpaces } from "@/utils/form-validation";
import { toast } from "react-hot-toast";

// Appwrite
import { AppwriteIds, databases } from "@/lib/appwrite-config";
import { Query } from "appwrite";


interface SearchModalProps { }


/**
 * HEADER WITH SEARCH
 * 
*/
interface HeaderProps {
    searchQuery: string | null;
    setSearchQuery: Dispatch<SetStateAction<string | null>>
    setResults: Dispatch<SetStateAction<Note[] | null>>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onClose: MouseEventHandler<HTMLButtonElement>;
}

const Header: FC<HeaderProps> = ({ searchQuery, setSearchQuery, setResults, onClose, onSubmit }) => {

    const ref = useRef<any>(null);
    const [searchModal] = useGlobalState("searchModal");

    useEffect(() => {
        if (ref && ref.current && searchModal === true) {
            ref.current.focus();
        }
    }, [searchModal, ref]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);

    }

    useEffect(() => {
        if (searchQuery === "") {
            setResults(null)
        }
    }, [searchQuery, setResults]);

    return (
        <div className="flex items-center justify-between px-2 border-b border-border-light">
            <form onSubmit={onSubmit} className="flex-1">
                <input
                    type="text"
                    ref={ref}
                    onChange={onChange}
                    placeholder="Type and hit enter to search..."
                    className="w-full h-14 px-4 outline-none text-lg font-semibold placeholder:text-sm placeholder:font-normal"
                />
            </form>

            <Button variant='black' size='square' onClick={onClose}>
                <TbX size={20} strokeWidth={1} className='' />
            </Button>
        </div>
    );
}



/**
 * EXPORTED PARENT COMPONENT
 * 
 */
const SearchModal: FC<SearchModalProps> = () => {

    // States
    const [searchModal] = useGlobalState("searchModal");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [results, setResults] = useState<Note[] | null>(null);
    const [resultsCount, setResultsCount] = useState<number>(0)


    // Hooks
    //
    const { activeNotebook } = useNotebook();


    // Search Notes
    const searchNotes = async (e: React.FormEvent<HTMLFormElement>, searchGlobal?: boolean) => {
        e.preventDefault();
        setIsLoading(true);

        // Search query cannot be empty
        if (searchQuery === null || searchQuery === "") {
            setIsLoading(false);
            return toast.error('Type something... 😓')
        };

        // Search query cannot contain only spaces
        if (containsOnlySpaces(searchQuery)) {
            setIsLoading(false);
            return toast.error('Query cannot contain only spaces');
        }

        // Search query must contain at least 3 characters
        if (searchQuery?.length < 3) {
            setIsLoading(false);
            return toast.error('Must contain at least 3 characters');
        }

        // If no active notebook is found, cancel fetch.
        if (activeNotebook === null) return

        let queries: string[] = [
            Query.search('search_index', searchQuery)
        ]

        // Search only in active notebook, if not global
        if (!searchGlobal) {
            queries.push(Query.equal('notebook_related', activeNotebook.$id));
        }

        try {
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                queries
            )

            setResults(res.documents as Note[]);
            setResultsCount(res.total);

        } catch (error) {
            console.log(error);
            toast.error('Unable to search');
        } finally {
            toast.dismiss();
            setIsLoading(false);
        }
    };


    // Handle close and reset
    const onClose = () => {
        setGlobalState('searchModal', !searchModal);
        setResults(null);
    }

    return (
        <Modal
            variant='full'
            title="Search"
            modalActive={searchModal}
            customHeader={
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setResults={setResults}
                    onSubmit={searchNotes}
                    onClose={onClose}
                />
            }
        >
            {results &&
                <h6 className="pt-4 px-4 text-sm text-neutral-500">Notes found: {resultsCount}</h6>
            }

            {results &&
                <Grid className=" sm:grid-cols-2 p-4 gap-4">
                    {results?.map((note: Note) => (
                        <div key={note.$id} onClick={onClose}>
                            <NoteCard note={note} asSearchResult={true} />
                        </div>
                    ))}
                </Grid>
            }

            {!results &&
                <div className="w-full h-full flex flex-col justify-center items-center">
                    {!isLoading &&
                        <>
                            <div className="mb-4 w-20 h-20 rounded-full flex justify-center items-center bg-slate-50 text-slate-300">
                                <TbSearch size={50} strokeWidth={0.5} />
                            </div>
                            <span className="text-slate-300 font-light">Search for notes and code snippets</span>
                        </>
                    }

                    {isLoading &&
                        <Spinner size='lg' />
                    }
                </div>
            }
        </Modal>
    );
}

export default SearchModal;
