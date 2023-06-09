// React
import { FC, useEffect, useState } from "react";

// Typings
import { Note, Todo } from "@/types/typings";

// Icons
import { TbGripHorizontal, TbX } from "react-icons/tb";

// Sortable
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move"
import { Button, Checkbox } from "@/components";
import { NoteType } from "@/types/enums";



/**
 * TODO ITEM
 * 
 */
interface TodoItemProps {
    todo: Todo;
    index: number
    onChangeContent: (index: number, newTitle: string) => void;
    onCheckItem: (index: number, checked: boolean) => void;
    onDelete: (index: number) => void;
}

const TodoItem: FC<TodoItemProps> = ({ todo, index, onChangeContent, onCheckItem, onDelete }) => {

    return (
        <div className="group relative w-full flex items-center mb-4 pr-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">

            <SortableKnob>
                <div className="p-4 cursor-move transition-all opacity-10 group-hover:opacity-50">
                    <TbGripHorizontal />
                </div>
            </SortableKnob>


            <div className="shrink-0 mr-4">
                <Checkbox
                    variant="circle"
                    checked={todo.done}
                    onChange={(e: any) => onCheckItem(index, e.target.checked)}
                    className="shrink-0 mr-4"
                />
            </div>

            <div className="flex-1">
                <input
                    type="text"
                    value={todo.title}
                    onChange={(e) => onChangeContent(index, e.target.value)}
                    className="flex-1 w-full h-14 outline-none bg-transparent"
                />
            </div>

            <Button onClick={() => onDelete(index)} variant='gray' size='small' className="hidden group-hover:flex">
                <TbX />
            </Button>
        </div>
    );
}



/**
 * EXPORTED PARENT COMPONENT
 * 
 */
interface TodoEditorProps {
    note: Note | null;
    onUpdateFormBody: (newBody: string) => void;
    changeDetector: boolean
    body: string;
}

const TodoEditor: FC<TodoEditorProps> = ({ note, onUpdateFormBody, changeDetector, body }) => {
    // States
    //
    const [data, setData] = useState<Todo[]>([]);

    // New item
    //
    const newItem: Todo = {
        title: "New item",
        done: false
    }


    // Add a new item
    //
    const onAddItem = () => {
        setData(data => [...data, newItem])
    }


    // Check box of a todo item
    //
    const onCheckItem = (index: number, checked: boolean) => {
        const newState = data.map((obj, i) => {
            if (i === index) {
                return { ...obj, done: checked };
            }

            return obj;
        });

        setData(newState);
    };


    // Changing content of a todo item
    //
    const onChangeContent = (index: number, newTitle: string) => {
        const newState = data.map((obj, i) => {
            if (i === index) {
                return { ...obj, title: newTitle };
            }

            return obj;
        });

        setData(newState);
    };


    // Delete a todo item
    //
    const onDelete = (index: number) => {
        let newData: Todo[] = new Array();

        for (let i = 0; i < data.length; i++) {
            if (i !== index) {
                newData.push(data[i]);
            }
        }

        setData(newData);
    }

    // Swapping items in array
    //
    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setData((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    }


    // First time load data
    //
    useEffect(() => {
        if (note && note.type === NoteType.todo && note.body !== "") {
            setData(JSON.parse(note.body))
        };
    }, []);


    // Update note body on change
    //
    useEffect(() => {
        onUpdateFormBody(JSON.stringify(data))
    }, [data]);


    return note?.type === NoteType.todo ? (
        <>
            <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
                {data?.map((todo, i) => (
                    <SortableItem key={i}>
                        <div>
                            <TodoItem todo={todo} index={i} onChangeContent={onChangeContent} onCheckItem={onCheckItem} onDelete={onDelete} />
                        </div>
                    </SortableItem>
                ))}
            </SortableList>


            <div className="text-center">
                <Button onClick={onAddItem} variant='black'>
                    Add Item
                </Button>
            </div>
        </>
    ) : null
}

export default TodoEditor;