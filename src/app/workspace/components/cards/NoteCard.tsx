
// React
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Typings
import { Note, Todo } from "@/types/typings";

// Icons
import * as Icons from "react-icons/tb";
import { NoteType } from "@/types/enums";

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
        if (note?.type === NoteType.code && note?.snippet_language === 'html') return note?.body.substring(0, 120);
        if (note?.type === NoteType.todo) return todoPreview()?.substring(0, 120);

        const newText = new DOMParser().parseFromString(note?.body, 'text/html');
        return newText.body.textContent?.substring(0, 120);

        function todoPreview() {
            if (!note || note.body === "") return "";
            let preview = "";
            const todoList: Todo[] = JSON.parse(note.body);
            for (let i = 0; i < todoList.length; i++) {
                const done = todoList[i].done ? "🟩 " : "🟥 ";
                preview += done + todoList[i].title;
                if (i + 1 !== todoList.length) preview += ", ";
            }
            return preview;
        }
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
            case 'javascript':
                color = "text-js";
                return "TbBrandJavascript";
                break;
            case 'typescript':
                color = "text-ts";
                return "TbBrandTypescript"
                break;
            case 'python':
                color = "text-py";
                return "TbBrandPython"
                break;
            case 'php':
                color = "text-php";
                return "TbBrandPhp"
                break;
            case 'csharp':
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
                color = "text-json dark:text-white";
                return "TbBraces"
                break;
            case 'kotlin':
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
            <Link href={`/workspace/${note?.$id}`} title={note?.title} className={`flex items-center w-full rounded-lg py-4 px-4 border border-transparent ${!asSearchResult && pathname === `/workspace/${note?.$id}` && '!border-primary'} ${asSearchResult && '!border-neutral-200 dark:!border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'} `}>

                {/* Icons */}
                <div className="shrink-0 w-10 h-10 flex items-center">
                    {/* Note icon */}
                    {note?.type === "note" && <DynamicIcon name="TbNotes" size={24} strokeWidth={1} className={`text-black dark:text-white`} />}
                    {/* Code snippet icons */}
                    {note?.type === "code" && <DynamicIcon name={setLanguageIcon(note)} size={24} strokeWidth={1} className={color} />}
                    {/* Todo */}
                    {note?.type === "todo" && <DynamicIcon name="TbListDetails" size={24} strokeWidth={1} className={`text-black dark:text-white`} />}
                </div>

                {/* Note title, subtitle or body */}
                <div className="flex-1">
                    <h5 className={`text-md font-semibold ${pathname === `/workspace/${note?.$id}` ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-200'} `}>
                        <span className="line-clamp-1">{note?.title || 'Untitled'}</span>
                    </h5>
                    {note?.subtitle && <h6 className="text-xs font-semibold text-neutral-400 line-clamp-2">{note?.subtitle}</h6>}
                    {!note?.subtitle && <p className="text-xs font-semibold text-neutral-500 line-clamp-2 break-all">{removeTags(note)}</p>}
                </div>

                {/* If starred */}
                {note?.starred && <DynamicIcon name="TbStarFilled" size={16} strokeWidth={1} className="shrink-0 ml-4 mb-4 text-star" />}

            </Link>
        </>
    );
}

export default NoteCard;