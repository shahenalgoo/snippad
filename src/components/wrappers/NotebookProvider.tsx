/**
 * Notebook Provider Wrap for the workspace
 * 
 */

'use client';

import { NotebookProvider as NotebookContextProvider } from '@/context/NotebookContext';

const NotebookProvider = ({ children }: any) => {
    return (
        <NotebookContextProvider>
            {children}
        </NotebookContextProvider>
    );
}

export default NotebookProvider;