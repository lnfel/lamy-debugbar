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
                    return `<pre class="${className}overflow-x-scroll px-4 py-4" style="${style}" tabindex="0">${children}</pre>`
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

<div class="fixed bottom-0 inset-x-0">
    <details class="lamy-details relative overflow-hidden {ready ? 'opacity-100' : 'opacity-0'}" bind:open>
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
                        {#if last(Object.entries(data), i)} <div class="hidden">{lamyIsReady()}</div> {/if}
                    {/await}
                {/each}
            {/if}
        </div>

        <summary
            class="lamy-toggle flex items-center justify-between list-none outline-none px-4"
            style="
                { shiki ? `background-color: ${shiki?.highlighter.getBackgroundColor(highlighter?.theme ?? 'material-palenight')};` : '' }
                { shiki ? `color: ${shiki?.highlighter.getForegroundColor(highlighter?.theme ?? 'material-palenight')}` : '' }
            ">
            <div class="flex items-center gap-4">
                <div>
                    <img src={LamyIcon} alt="Lamy Debugbar icon" width="24" class="py-2">
                    <span class="lamy-summary-text sr-only">Lamy Debugbar</span>
                </div>
                <div class="lamy-tablist flex max-w-full overflow-x-auto">
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
</style>
