'use client';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

const page = () => {
    return (
        <div>
            <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />
        </div>
    );
}

export default page;