import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        data?: {} | undefined;
        open?: boolean | undefined;
        highlighter?: import("shiki-es").HighlighterOptions | undefined;
        customTheme?: Object | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: any;
    };
};
export type LamyDebugbarProps = typeof __propDef.props;
export type LamyDebugbarEvents = typeof __propDef.events;
export type LamyDebugbarSlots = typeof __propDef.slots;
export default class LamyDebugbar extends SvelteComponentTyped<{
    data?: {} | undefined;
    open?: boolean | undefined;
    highlighter?: import("shiki-es").HighlighterOptions | undefined;
    noIcon?: boolean;
    customTheme?: Object | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    icon: any;
}> {
}
export {};
