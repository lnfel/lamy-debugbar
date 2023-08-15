<script>
    import { onMount, afterUpdate, tick } from "svelte"
    import Shiki, { defaultHighlighterOptions } from "$lib/shiki.js"
    /**
     * Using Twind in library mode
     *
     * https://twind.style/library-mode
     */
    import { tw } from "$lib/twind.js"

    import LamyIcon from "$lib/assets/lamy-logo-192x192.png"
    import Pulse from "$lib/components/Pulse.svelte"

    export let data = {}
    /** @type {import('shiki-es').HighlighterOptions} */
    export let highlighter = defaultHighlighterOptions
    export let open = false
    export let noIcon = false
    /** @type {any} */
    export let customTheme = undefined
    /** @type {Boolean} */
    export let offline = false

    let shiki = Shiki
    /** @type {import('shiki-es').IShikiTheme | undefined} */
    let currentTheme
    /** @type {String[]} */
    let shikiHTML = []
    let ready = false

    /**
     * @param {import('shiki-es').IThemeRegistration} theme
     */
    async function loadTheme(theme) {
        if (shiki.highlighter) {
            await shiki.highlighter?.loadTheme(theme)
            /** @ts-ignore */
            if ((shiki.highlighter?.getLoadedThemes()).includes(highlighter?.theme)) {
                currentTheme = shiki.highlighter?.getTheme(highlighter?.theme)
            }
            renderShiki(data)
        }
    }

    /**
     * 
     * @param {any} theme
     */
    async function loadCustomTheme(theme) {
        if (theme) {
            const iShikiTheme = shiki.toShikiTheme(theme)
            await shiki.highlighter?.loadTheme(iShikiTheme)
            currentTheme = shiki.highlighter?.getTheme(iShikiTheme.name)
            renderShiki(data)
        }
    }

    /**
     * @param {Object} data
     * @returns {String[]} Array of HTMLElement strings
     */
    function renderShiki(data) {
        const html = []
        for (const [key, code] of Object.entries(data)) {
            if (shiki.highlighter) {
                const tokens = shiki.highlighter.codeToThemedTokens(JSON.stringify(code, null, 2), 'js', currentTheme?.name, { includeExplanation: false })
                /** @type {import('shiki-es').HtmlRendererOptions} */
                const options = {
                    bg: currentTheme?.bg,
                    elements: {
                        pre({ className, style, children }) {
                            return `<pre class="${className} ${tw('overflow-x-scroll px-4 py-4')}" style="${style}" tabindex="0">${children}</pre>`
                        }
                    }
                }
                html.push(shiki.renderToHtml(tokens, options))
            }
        }
        shikiHTML = html

        return shikiHTML
    }

    /**
     * @param {Event|null & { target: HTMLButtonElement }} event
     */
    function switchTab(event) {
        if (shiki.highlighter && currentTheme) {
            /**
             * @type {NodeListOf<HTMLButtonElement>|null}
             */
            const tabButtons = document.querySelectorAll('.lamy-tab')
            tabButtons?.forEach((button) => {
                button.style.background = 'transparent'
                button.classList.remove(`!bg-[${currentTheme?.colors?.['titleBar.inactiveForeground'] ?? currentTheme?.colors?.['titleBar.activeBackground'] ?? currentTheme?.colors?.['menu.background']}]`)
                button.classList.remove(`!text-[${currentTheme?.colors?.['tab.activeForeground'] ?? currentTheme?.colors?.['menu.foreground']}]`)
            })

            const tabContents = document.querySelectorAll('.lamy-tab-content')
            tabContents?.forEach((content) => {
                content.classList.add(tw('hidden'))
            })

            if (event?.target instanceof HTMLButtonElement && currentTheme.colors) {
                event.target.classList.add(`!bg-[${currentTheme?.colors?.['titleBar.inactiveForeground'] ?? currentTheme?.colors?.['titleBar.activeBackground'] ?? currentTheme?.colors?.['menu.background']}]`)
                event.target.classList.add(`!text-[${currentTheme?.colors?.['tab.activeForeground'] ?? currentTheme?.colors?.['menu.foreground']}]`)
                document.querySelector(`.lamy-tab-content.${event.target.id}`)?.classList.remove(tw('hidden'))

                /** @type {HTMLElement|null} */
                const detailsElement = document.querySelector('.lamy-details')
                if (detailsElement) {
                    detailsElement.dataset.current = event.target.dataset.index
                }
            }
        }
    }

    $: {
        if (shiki.highlighter && !customTheme && highlighter) {
            /** @ts-ignore */
            loadTheme(highlighter.theme)
        } else if (shiki.highlighter && customTheme) {
            loadCustomTheme(customTheme)
        }
        renderShiki(data)
    }

    onMount(async () => {
        // wait for offline prop to populate from localStorage
        // in most cases we don't need doing this as users would
        // only need to set offline prop either true or false
        await tick()
        if (offline) {
            const wasm = await fetch('shiki/onig.wasm')
            shiki.setWasm(wasm)
            shiki.setCDN('shiki/')
        }
        await shiki.getHighlighter(highlighter)
        if (customTheme) {
            await loadCustomTheme(customTheme)
        } else {
            /** @ts-ignore */
            await loadTheme(highlighter.theme)
        }
        currentTheme = shiki.highlighter?.getTheme(customTheme?.name ?? highlighter?.theme)
        
        shikiHTML = renderShiki(data)
        ready = true
    })

    afterUpdate(() => {
        /** @type {NodeListOf<HTMLElement>} */
        const lamyTabContents = document.querySelectorAll('.lamy-tab-content')
        lamyTabContents.forEach((element, key) => {
            element.dataset.index = `${key}`
        })

        /** @type {NodeListOf<HTMLButtonElement>} */
        const lamyTabs = document.querySelectorAll('.lamy-tab')
        for (const element of lamyTabs) {
            element.style.background = 'transparent'
            element.style.color = currentTheme?.fg ?? ''
        }

        /** @type {HTMLElement|null} */
        const detailsElement = document.querySelector('.lamy-details')
        if (detailsElement) {
            lamyTabs[Number(detailsElement.dataset.current)].click()
        }
    })

    /**
     * Toggle details element
     */
    function toggleDetails() {
        /** @type {HTMLDetailsElement|null} */
        const detailsElement = document.querySelector('.lamy-details')
        if (detailsElement) {
            detailsElement.open = !detailsElement.open
        }
    }
</script>

{#if ready}
    <div class={`lamy-debugbar ${tw('fixed bottom-0 inset-x-0')}`}>
        <details class={`lamy-details ${tw('relative overflow-hidden')}`} bind:open data-current="0">
            <div class={`${tw('max-h-96 border-t border-gray-700 overflow-x-hidden overflow-y-auto')}`}>
                <!-- Render shiki html here -->
                {#each shikiHTML as element, i}
                    <div class="lamy-tab-content {Object.keys(data)[i]} {i === 0 ? '' : tw('hidden')}">{@html element}</div>
                {/each}
            </div>

            <summary class={`lamy-toggle ${tw('flex items-center justify-between list-none outline-none')} ${tw(`bg-[${currentTheme?.colors?.['titleBar.inactiveBackground'] ?? currentTheme?.bg}]`)} ${tw(`text-[${currentTheme?.fg}]`)}`}>
                <!--
                    Flexbox apparently has min-width: auto; and
                    would not shrink further on small screens, setting min-width: 0; allows flexbox to shrink even further
                    https://stackoverflow.com/questions/36230944/prevent-flex-items-from-overflowing-a-container
                -->
                <div class={`${tw('flex items-center min-w-0')}`}>
                    {#if !noIcon}
                        {#if $$slots.icon}
                            <slot name="icon" />
                        {:else}
                            <div>
                                <img src={LamyIcon} alt="Lamy Debugbar icon" width="40" height="40" class={`${tw('max-h-10 object-contain py-2')}`}>
                                <span class={`lamy-summary-text ${tw('sr-only')}`}>Lamy Debugbar</span>
                            </div>
                        {/if}
                    {/if}

                    <div class={`lamy-tablist ${tw('flex overflow-x-auto')}`}>
                        {#each Object.keys(data) as key, i}
                            <button on:click={switchTab} id={key} data-index="{i}" type="button"
                                class={`lamy-tab ${tw('whitespace-nowrap px-2 py-2 outline-none')} ${i === 0 ? tw(`!text-[${currentTheme?.colors?.['tab.activeForeground'] ?? currentTheme?.colors?.['menu.foreground']}] !bg-[${currentTheme?.colors?.['titleBar.inactiveForeground'] ?? currentTheme?.colors?.['titleBar.activeBackground'] ?? currentTheme?.colors?.['menu.background']}]`) : tw(`bg-[${currentTheme?.colors?.['titleBar.inactiveBackground'] ?? currentTheme?.bg}] !hover:text-[${currentTheme?.colors?.['tab.activeForeground'] ?? currentTheme?.colors?.['menu.foreground']}]`)} `}>
                                { key }
                            </button>
                        {/each}
                    </div>
                </div>

                <button on:click={toggleDetails} class={`lamy-toggle-arrow ${tw(`px-2 py-2 outline-none hover:text-[${currentTheme?.colors?.['tab.activeForeground']}] hover:bg-[${currentTheme?.colors?.['titleBar.inactiveForeground'] ?? currentTheme?.colors?.['titleBar.activeBackground'] ?? currentTheme?.colors?.['menu.background']}]`)}`} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`${tw('w-6 h-6')}`}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </button>
            </summary>
        </details>
    </div>
{:else}
    <div class={`${tw('fixed bottom-0 inset-x-0')}`}>
        <Pulse />
    </div>
{/if}
