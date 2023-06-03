import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    sidebar: false as boolean,
});

export { useGlobalState, setGlobalState };