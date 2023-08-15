import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        data?: {} | undefined;
        open?: boolean | undefined;
        highlighter?: import("shiki-es").HighlighterOptions | undefined;
        noIcon?: boolean;
        customTheme?: any;
        offline?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {};
    };
};
export type LamyDebugbarProps = typeof __propDef.props;
export type LamyDebugbarEvents = typeof __propDef.events;
export type LamyDebugbarSlots = typeof __propDef.slots;
export default class LamyDebugbar extends SvelteComponent<{
    data?: {} | undefined;
    open?: boolean | undefined;
    highlighter?: import("shiki-es").HighlighterOptions | undefined;
    noIcon?: boolean;
    customTheme?: any;
    offline?: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    icon: {};
}> {
}
export {};
