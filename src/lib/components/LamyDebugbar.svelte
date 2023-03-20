<script>
    import { renderToHtml } from 'shiki-es'
	import { onMount, afterUpdate, beforeUpdate } from 'svelte'
    import Shiki, { shikiHighlighter } from "../shiki.js"
    import LamyIcon from "$lib/assets/lamy-logo-192x192.png"

    export let data = {}
    export let open = false
    
    /**
     * @type {import('shiki-es').HighlighterOptions}
     */
    export let highlighter = {}
    /**
     * @type {undefined|Shiki}
     */
    let shiki
    let ready = false

    onMount(async () => {
        shiki = await new Shiki(shikiHighlighter, highlighter)

        /**
         * @type {HTMLElement|null}
         */
        const toggleButton = document.querySelector('.lamy-toggle-arrow')

        toggleButton?.addEventListener('click', (event) => {
            /**
             * @type {HTMLDetailsElement|null}
             */
            const detailsElement = document.querySelector('.lamy-details')
            if (detailsElement) {
                detailsElement.open = !detailsElement?.open
            }
        })
    })

    /**
     * 
     * @param {Object|undefined} code
     */
    const renderShiki = async (code) => {
        if (!shiki) return

        const tokens = shiki?.highlighter.codeToThemedTokens(JSON.stringify(code, null, 2), 'javascript')
        // console.log(shiki?.highlighter.getTheme(highlighter?.theme ?? 'material-palenight'))

        return renderToHtml(tokens, {
            bg: shiki?.highlighter.getBackgroundColor(highlighter?.theme ?? 'material-palenight'),
            elements: {
                pre({ className, style, children }) {
                    return `<pre class="${className} overflow-x-scroll px-4 py-4" style="${style}" tabindex="0">${children}</pre>`
                }
            }
        })
    }

    const lamyIsReady = () => {
        ready = true
    }

    /**
     * Check last item on svelte #each block
     * 
     * @param {Array<any>} array
     * @param {Number} currentIteration
     * @returns {Boolean}
     */
    const last = (array, currentIteration) => {
        return currentIteration == array.length - 1
    }

    /**
     * 
     * @param {Event|null & { target: HTMLButtonElement }} event
     */
    const switchTab = async (event) => {
        const activeTabColor = shiki?.highlighter.getTheme(highlighter?.theme ?? 'material-palenight').colors["terminal.ansiBlue"]
        const foregroundColor = shiki?.highlighter.getForegroundColor(highlighter?.theme ?? 'material-palenight')
        /**
         * @type {NodeListOf<HTMLButtonElement>|null}
         */
        const tabButtons = document.querySelectorAll('.lamy-tab')
        tabButtons?.forEach((button) => {
            button.style.color = foregroundColor
        })

        const tabContents = document.querySelectorAll('.lamy-tab-content')
        tabContents?.forEach((content) => {
            content.classList.add('hidden')
        })

        if (event?.target instanceof HTMLButtonElement) {
            event.target.style.color = activeTabColor
            document.querySelector(`.lamy-tab-content.${event.target.id}`)?.classList.remove('hidden')
        }
    }
</script>

<div class="lamy-debugbar fixed bottom-0 inset-x-0">
    <details class="lamy-details relative overflow-hidden" style="{ready ? 'display: block;' : 'display: none;'}" bind:open>
        <div class="max-h-96 border-t border-gray-700 overflow-x-hidden overflow-y-auto">
            <!--
                If block is required so when shiki is available,
                re-render would trigger and the await block would evaluate
            -->
            {#if shiki}
                {#each Object.entries(data) as [key, value], i}
                    {#await renderShiki(value)}
                        <span>Loading data</span>
                    {:then shikiHTML} 
                        <div class="lamy-tab-content {key} {i === 0 ? '' : 'hidden'}">{@html shikiHTML}</div>
                        <!-- Show details element when shiki is done rendering all data -->
                        {#if last(Object.entries(data), i)} <div style="display: none;">{lamyIsReady()}</div> {/if}
                    {/await}
                {/each}
            {/if}
        </div>

        <summary
            class="lamy-toggle flex items-center justify-between list-none outline-none"
            style="
                { shiki ? `background-color: ${shiki?.highlighter.getBackgroundColor(highlighter?.theme ?? 'material-palenight')};` : '' }
                { shiki ? `color: ${shiki?.highlighter.getForegroundColor(highlighter?.theme ?? 'material-palenight')}` : '' }
            ">
            <!--
                Flexbox apparently has min-width: auto; and
                would not shrink further on small screens, setting min-width: 0; allows flexbox to shrink even further
                https://stackoverflow.com/questions/36230944/prevent-flex-items-from-overflowing-a-container
            -->
            <div class="flex items-center min-w-0">
                <div>
                    <img src={LamyIcon} alt="Lamy Debugbar icon" width="40" height="40" class="max-h-10 object-contain py-2">
                    <span class="lamy-summary-text sr-only">Lamy Debugbar</span>
                </div>
                <div class="lamy-tablist flex overflow-x-auto">
                    {#each Object.keys(data) as key, i}
                        <button on:click={switchTab} id={key} type="button" class="lamy-tab whitespace-nowrap px-2 py-2 outline-none hover:bg-gray-600 focus:bg-gray-600"
                            style="{ i === 0 ? `color: ${shiki?.highlighter.getTheme(highlighter?.theme ?? 'material-palenight').colors["terminal.ansiBlue"]}` : '' }">
                            { key }
                        </button>
                    {/each}
                </div>
            </div>

            <button class="lamy-toggle-arrow px-2 py-2 outline-none hover:bg-gray-600 focus:bg-gray-600" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            </button>
        </summary>
    </details>
</div>

<style>
    summary.lamy-toggle:focus > button.lamy-toggle-arrow {
        background-color: rgb(75 85 99);
    }

    *,
    ::before,
    ::after {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: #e5e7eb;
    }

    ::before,
    ::after {
        --tw-content: '';
    }

    :global(.lamy-debugbar) {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -moz-tab-size: 4;
        -o-tab-size: 4;
            tab-size: 4;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        font-feature-settings: normal;
    }

    :global(.lamy-details code),
    :global(.lamy-details kbd),
    :global(.lamy-details samp),
    :global(.lamy-details pre) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 1em;
    }

    :global(.lamy-debugbar button) {
        font-family: inherit;
        font-size: 100%;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        margin: 0;
        padding: 0;
    }

    :global(.lamy-debugbar button) {
        text-transform: none;
    }

    :global(.lamy-debugbar button),
    :global(.lamy-debugbar [type='button']),
    :global(.lamy-debugbar [type='reset']),
    :global(.lamy-debugbar [type='submit']) {
        -webkit-appearance: button;
        appearance: button;
        background-color: transparent;
        background-image: none;
    }

    :-moz-focusring {
        outline: auto;
    }

    :-moz-ui-invalid {
        box-shadow: none;
    }

    :global(.lamy-debugbar summary) {
        display: list-item;
    }

    :global(.lamy-debugbar pre) {
        margin: 0;
    }

    :global(.lamy-debugbar button),
    :global(.lamy-debugbar  [role="button"]) {
        cursor: pointer;
    }

    :disabled {
        cursor: default;
    }

    img,
    svg {
        display: block;
        /* vertical-align: middle; */
    }

    img {
        max-width: 100%;
        height: auto;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .fixed {
        position: fixed;
    }

    .relative {
        position: relative;
    }

    .inset-x-0 {
        left: 0px;
        right: 0px;
    }

    .bottom-0 {
        bottom: 0px;
    }

    .block {
        display: block;
    }

    .flex {
        display: flex;
    }

    .hidden {
        display: none;
    }

    .h-6 {
        height: 1.5rem;
    }

    .max-h-10 {
        max-height: 2.5rem;
    }

    .max-h-96 {
        max-height: 24rem;
    }

    .w-6 {
        width: 1.5rem;
    }

    .min-w-0 {
        min-width: 0px;
    }

    .shrink {
        flex-shrink: 1;
    }

    .list-none {
        list-style-type: none;
    }

    .items-center {
        align-items: center;
    }

    .justify-between {
        justify-content: space-between;
    }

    .overflow-hidden {
        overflow: hidden;
    }

    .overflow-x-auto {
        overflow-x: auto;
    }

    .overflow-y-auto {
        overflow-y: auto;
    }

    .overflow-x-hidden {
        overflow-x: hidden;
    }

    .overflow-x-scroll {
        overflow-x: scroll;
    }

    .whitespace-nowrap {
        white-space: nowrap;
    }

    .border-t {
        border-top-width: 1px;
    }

    .border-gray-700 {
        --tw-border-opacity: 1;
        border-color: rgb(55 65 81 / var(--tw-border-opacity))
    }

    .object-contain {
        -o-object-fit: contain;
        object-fit: contain;
    }

    .px-2 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    :global(.shiki.px-4) {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    :global(.shiki.py-4) {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .opacity-0 {
        opacity: 0;
    }

    .opacity-100 {
        opacity: 1;
    }

    .outline-none {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }

    .hover\:bg-gray-600:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(75 85 99 / var(--tw-bg-opacity));
    }

    .focus\:bg-gray-600:focus {
        --tw-bg-opacity: 1;
        background-color: rgb(75 85 99 / var(--tw-bg-opacity));
    }
</style>
