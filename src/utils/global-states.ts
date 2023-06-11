/**
 * Handle global states
 * 
 */

import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    darkMode: false as boolean,
    sidebar: false as boolean,
    notebookSwitcher: false as boolean,
    searchModal: false as boolean
});

export { useGlobalState, setGlobalState };