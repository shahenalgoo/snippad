import { FC } from "react";

interface CharacterCountProps {
    characterCount: number;
    wordCount: number;
}

const CharacterCount: FC<CharacterCountProps> = ({ characterCount, wordCount }) => {


    return (
        <>
            <div className="hidden lg:flex items-center justify-center flex-col rounded-full mr-2 px-6 backdrop-blur-md bg-black/5 dark:bg-white/5">
                <span className="text-xs font-semibold">{characterCount} / {5000} chars</span>
                <span className="text-xs font-semibold">{wordCount} {wordCount <= 1 ? 'word' : 'words'}</span>
            </div>
        </>
    );
}

export default CharacterCount;