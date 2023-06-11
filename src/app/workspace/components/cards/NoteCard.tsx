
// React
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Typings
import { Note } from "@/types/typings";

// Icons
import * as Icons from "react-icons/tb";

interface NoteCardProps {
    note: Note | null;
    asSearchResult: boolean;
}

const NoteCard: FC<NoteCardProps> = ({ note, asSearchResult }) => {
    // Hooks
    //
    const pathname = usePathname();


    // Remove HTML tags from string for non-HTML bodies (in sidebar preview)
    const removeTags = (note: Note | null) => {
        if (note?.body == null || undefined || '') return '';
        if (note?.type === "code" && note?.snippet_language === 'html') return note?.body.substring(0, 120);

        const newText = new DOMParser().parseFromString(note?.body, 'text/html');
        return newText.body.textContent?.substring(0, 120);
    }

    let color = "";
    // Assign the correct icon for the file type
    function setLanguageIcon(note: Note) {
        switch (note.snippet_language) {
            case 'html':
                color = "text-html";
                return "TbBrandHtml5";
                break;
            case 'css':
                color = "text-css";
                return "TbBrandCss3";
                break;
            case 'js':
                color = "text-js";
                return "TbBrandJavascript";
                break;
            case 'ts':
                color = "text-ts";
                return "TbBrandTypescript"
                break;
            case 'py':
                color = "text-py";
                return "TbBrandPython"
                break;
            case 'php':
                color = "text-php";
                return "TbBrandPhp"
                break;
            case 'cs':
                color = "text-cs";
                return "TbBrandCSharp"
                break;
            case 'cpp':
                color = "text-cpp";
                return "TbBrandCpp"
                break;
            case 'java':
                color = "text-java";
                return "TbCoffee"
                break;
            case 'json':
                color = "text-json";
                return "TbBraces"
                break;
            case 'kt':
                color = "text-kt";
                return "TbBrandKotlin"
                break;
            case 'sql':
                color = "text-sql";
                return "TbSql"
                break;
            default:
                color = "text-code";
                return "TbCode"
                break;
        }
    }

    //@ts-ignore
    const DynamicIcon = ({ name, className, size, strokeWidth }) => {
        //@ts-ignore
        const IconComponent = Icons[name];
        return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />
    }

    return (
        <>
            <Link href={`/workspace/${note?.$id}`} title={note?.title} className={`flex items-center w-full rounded-lg py-4 px-4 border border-transparent ${!asSearchResult && pathname === `/workspace/${note?.$id}` && '!border-primary'} ${asSearchResult && '!border-neutral-200 hover:bg-neutral-50'} `}>

                {/* Icons */}
                <div className="shrink-0 w-10 h-10 flex items-center">
                    {/* Default note icon */}
                    {note?.type === "note" && <DynamicIcon name="TbNotes" size={24} strokeWidth={1} className={`text-neutral-600 dark:text-neutral-200`} />}
                    {/* Code snippet icons */}
                    {note?.type === "code" && <DynamicIcon name={setLanguageIcon(note)} size={24} strokeWidth={1} className={color} />}
                </div>

                {/* Note title, subtitle or body */}
                <div className="flex-1">
                    <h5 className={`text-md font-semibold ${pathname === `/workspace/${note?.$id}` ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400'} `}>
                        <span className="line-clamp-1">{note?.title || 'Untitled'}</span>
                    </h5>
                    {note?.subtitle && <h6 className="text-xs font-semibold text-neutral-400 line-clamp-2">{note?.subtitle}</h6>}
                    {!note?.subtitle && <p className="text-xs font-semibold text-neutral-500 line-clamp-2">{removeTags(note)}</p>}
                </div>

                {/* If starred */}
                {note?.starred && <DynamicIcon name="TbStarFilled" size={16} strokeWidth={1} className="shrink-0 ml-4 mb-4 text-star" />}

            </Link>
        </>
    );
}

export default NoteCard;