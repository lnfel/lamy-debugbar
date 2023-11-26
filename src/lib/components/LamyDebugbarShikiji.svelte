<script>
    import { onMount, tick } from "svelte"
    import { browser } from "$app/environment"
    import { writable } from "svelte/store"
    import { crossfade, slide } from 'svelte/transition'
    import { cubicInOut } from 'svelte/easing'
    import { createCollapsible, createTabs, melt } from '@melt-ui/svelte'
    import { getHighlighter, addClassToHast } from 'shikiji'
    /**
     * Using Twind in library mode
     *
     * https://twind.style/library-mode
     */
    import { tw } from "$lib/twind.js"

    import LamyIcon from "$lib/assets/lamy-logo-192x192.png"
    import Pulse from "$lib/components/Pulse.svelte"

    const defaultHighlighterOptions = {
        themes: ['material-theme-palenight'],
        langs: ['javascript']
    }

    /**
     * @description The object that will be displayed by Lamy Debugbar.
     * @default {} - Empty object
     */
    export let data = {}
    /**
     * @description Shiki 式辞's BundledHighlighterOptions
     * @type {import('shikiji').BundledHighlighterOptions<import('shikiji').BuiltinLanguage, import('shikiji').BuiltinTheme>}
     * @default { themes: ['material-theme-palenight'], langs: ['javascript'] }
     */
    export let highlighter = defaultHighlighterOptions
    /**
     * @description Toggles debugbar between expanded and collapsed state
     * @type {Boolean}
     * @default false
     */
    export let open = false
    /**
     * @description Whether to display debugbar icon.
     * @type {Boolean}
     * @default false
     */
    export let noIcon = false
    /**
     * @description Load a custom theme that is not shipped with shiki by default. Examples are [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme/tree/master/themes) and [SynthWave 84](https://github.com/robb0wen/synthwave-vscode/blob/master/themes/synthwave-color-theme.json). Note that shiki only accepts valid JSON syntax and will reject malformed JSON, if you have trouble loading a custom theme, check first to see if the json data is strictly valid. Trailing commas and comments are usually the issue.
     * @type {any}
     * @default null
     */
    export let customTheme = null
    /**
     * @typedef {Boolean | 'auto'} PrefersReducedMotion
     */
    /**
     * @description Toggle transition animations or let the browser decide
     *  - true - Manually disable transition animations
     *  - false - Manually enable transition animations
     *  - auto - Uses prefers-reduced-motion to decide whether to enable transitions
     * @type {Boolean | 'auto'}
     * @default 'auto'
     */
    // svelte-ignore unused-export-let
    // export let prefersReducedMotion = 'auto'
    /**
     * @deprecated
     * @descriptionFor convenience, an offline prop is exposed to allow component to function as expected while working locally without internet. This requires the project you are working on to host the shiki themes and language you are expected to be using as well as the oniguruma wasm file.
     * @type {Boolean}
     * @default false
     */
    // svelte-ignore unused-export-let
    export let offline = false

    /**
     * @type {import('svelte/store').Writable<import('shikiji').Highlighter | null>}
     */
    const shiki = writable(null)
    /**
     * @description Current theme applied
     * @type {import('svelte/store').Writable<import('shikiji').ThemeRegistration>}
     */
    const currentTheme = writable()
    /**
     * @description Debugbar ready state
     */
    const ready = writable(false)

    const {
        elements: { root: collapsibleRoot, content: collapsibleContent, trigger: collapsibleTrigger },
        states: { open: collapsibleOpen }
    } = createCollapsible({
        defaultOpen: open,
        // forceVisible: true,
    })

    const {
        elements: { root: tabsRoot, list: tabsList, content: tabsContent, trigger: tabsTrigger },
        states: { value: currentTab }
    } = createTabs({
        defaultValue: 'route',
        onValueChange: ({ curr, next }) => {
            // https://chriscoyier.net/2022/12/21/things-css-could-still-use-heading-into-2023/#animate-to-auto
            const displayNextTabcontent = () => {
                const currentTabcontent = document.querySelector(`[aria-labelledby="${curr}"]`)
                const nextTabcontent = document.querySelector(`[aria-labelledby="${next}"]`)
                const transitionName = `tab-to-${nextTabcontent?.getAttribute('aria-labelledby')}`
                if (currentTabcontent instanceof HTMLElement && nextTabcontent instanceof HTMLElement) {
                    currentTabcontent.style.viewTransitionName = transitionName
                    // currentTabcontent.style.display = 'none'

                    nextTabcontent.style.viewTransitionName = transitionName
                    // nextTabcontent.style.display = 'block'

                    // currentTabcontent.classList.remove(tw('grid-rows-[1fr]'))
                    // currentTabcontent.classList.add(tw('grid-rows-[0fr]'))
                    // nextTabcontent.classList.remove(tw('grid-rows-[0fr]'))
                    // nextTabcontent.classList.add(tw('grid-rows-[1fr]'))
                    currentTabcontent.setAttribute('hidden', 'true')
                    nextTabcontent.removeAttribute('hidden')
                    currentTabcontent.style.viewTransitionName = ''
                    nextTabcontent.style.viewTransitionName = ''
                }
            }

            if (!document.startViewTransition) {
                // displayNextTabcontent()
                return next
            }

            if ($collapsibleOpen) {
                // const transition = document.startViewTransition(() => displayNextTabcontent())
            }
            return next
        }
    })

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut
    })

    /**
     * @description Load bundled theme
     * @param {import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} theme
     */
    async function loadTheme(theme) {
        if ($shiki) {
            await $shiki.loadTheme(theme)
            $currentTheme = $shiki.getTheme(/** @type {String | import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (highlighter.themes?.at(0)))
        }
    }

    /**
     * @description Load custom theme
     * @see {@link https://github.com/antfu/shikiji/blob/main/docs/themes.md | Load Custom Themes}
     * @param {import('shikiji').ThemeRegistrationRaw} theme
     */
    async function loadCustomTheme(theme) {
        console.log('[loadCustomTheme] theme: ', theme)
        if (theme && $shiki) {
            await $shiki.loadTheme(theme)
            $currentTheme = $shiki.getTheme(/** @type {String | import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (theme.name))
        }
    }

    onMount(async () => {
        shiki.set(await getHighlighter(Object.assign(defaultHighlighterOptions, highlighter)))
        if ($shiki) {
            if (customTheme) {
                await loadCustomTheme(customTheme)
                $currentTheme = $shiki.getTheme(/** @type {String | import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (customTheme.name))
            } else {
                await loadTheme(/** @type {import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (highlighter.themes?.at(0)))
                $currentTheme = $shiki.getTheme(/** @type {String | import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (highlighter.themes?.at(0)))
            }
        }
        $ready = true
    })

    /**
     * TODO: Respect users reduced motion preference
     * @param {PrefersReducedMotion} prefersReducedMotion
     */
    async function reduceMotion(prefersReducedMotion) {
        const transitionClass = tw('transition-all duration-300 ease-linear')
        console.log('transitionClass: ', transitionClass)
        console.log('transitionClass split: ', ...transitionClass.split(' ').map(value => `'${value}',`))
        const reduceMotionPreferenceMap = {
            'true': async () => {console.log('Reduced motion.')},
            'false': async () => {console.log('Gotta go fast.')},
            'auto': async () => {
                await tick()
                console.log('Chotto matte.')
                const query = window.matchMedia('(prefers-reduced-motion: reduce)')
                console.log('query.matches: ', query.matches)
                const tabscontentItems = document.querySelectorAll('.lamy-tabscontent-item')
                if (tabscontentItems) {
                    console.log('Got tabscontentItems!')
                    if (query.matches) {
                        console.log('prefers-reduced-motion: reduce matched!')
                        tabscontentItems.forEach((element) => {
                            element.classList.remove(...transitionClass.split(' '))
                        })
                    } else {
                        console.log('prefers-reduced-motion: reduce did not matched!')
                        tabscontentItems.forEach((element) => {
                            element.classList.add(...transitionClass.split(' '))
                        })
                    }
                }
                console.log(document.querySelectorAll('.lamy-tabscontent-item'))
            }
        }
        await reduceMotionPreferenceMap[`${prefersReducedMotion}`]()
    }

    /**
     * @type String
     */
    let resolvedCurrentTabValue

    /**
     * @param {Promise<String> | String} currentTabValue
     */
    async function resolveCurrentTabValue(currentTabValue) {
        resolvedCurrentTabValue = await Promise.resolve(currentTabValue)
        // console.log('resolvedCurrentTabValue: ', resolvedCurrentTabValue)
    }

    $: {
        if ($shiki && !customTheme && highlighter) {
            loadTheme(/** @type{import('shikiji').ThemeRegistration | import('shikiji').ThemeRegistrationRaw} */ (highlighter.themes?.at(0)))
        } else if ($shiki && customTheme) {
            loadCustomTheme(customTheme)
        }
    }
    $: $collapsibleOpen = open
    $: resolveCurrentTabValue($currentTab)
    // TODO: Respect users reduced motion preference
    // $: {
    //     if (browser && $ready) {
    //         reduceMotion(prefersReducedMotion)
    //     }
    // }
</script>

{#if $ready}
    <div use:melt={$collapsibleRoot} class="lamy-debugbar {tw('fixed bottom-0 inset-x-0')}">
        <div use:melt={$tabsRoot} class="lamy-main {tw('relative overflow-hidden')}">
            <div class="lamy-header {tw('flex items-center justify-between list-none outline-none')} {tw(`bg-[${$currentTheme?.colors?.['titleBar.activeBackground'] ?? $currentTheme?.bg}]`)} {tw(`text-[${$currentTheme?.colors?.['titleBar.activeForeground'] ?? $currentTheme?.fg}]`)}">
                <!--
                    Flexbox apparently has min-width: auto; and
                    would not shrink further on small screens, setting min-width: 0; allows flexbox to shrink even further
                    https://stackoverflow.com/questions/36230944/prevent-flex-items-from-overflowing-a-container
                -->
                <div class="{tw('flex items-center min-w-0')}">
                    {#if !noIcon}
                        {#if $$slots.icon}
                            <slot name="icon" />
                        {:else}
                            <div>
                                <img src={LamyIcon} alt="Lamy Debugbar icon" width="40" height="40" class="{tw('max-h-10 object-contain py-2')}">
                                <span class="lamy-summary-text {tw('sr-only')}">Lamy Debugbar</span>
                            </div>
                        {/if}
                    {/if}

                    <div use:melt={$tabsList} class="lamy-tabslist {tw('flex overflow-x-auto')}">
                        {#each Object.keys(data) as key, i}
                            <button use:melt={$tabsTrigger(key)} class="lamy-tab relative {tw(`whitespace-nowrap px-2 py-2 outline-none ${$currentTab === key ? 'opacity-100' : 'opacity-75'}`)} hover:opacity-100 focus:opacity-100">
                                {key}
                                <!-- resolvedCurrentTabValue -->
                                {#if resolvedCurrentTabValue === key}
                                    <div in:send={{ key: 'trigger' }} out:receive={{ key: 'trigger' }} class="{tw('absolute bottom-1 left-1/2 h-0.5 w-full -translate-x-1/2')} {tw(`bg-[${$currentTheme?.colors?.['titleBar.activeForeground'] ?? $currentTheme?.fg}]`)}"></div>
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>

                <button use:melt={$collapsibleTrigger} tabindex="-1" class="lamy-filler-button flex-1 self-stretch outline-none"></button>

                <button use:melt={$collapsibleTrigger} class="lamy-toggle-arrow {tw(`px-2 py-2 outline-none`)} {tw(`hover:bg-[${$currentTheme?.colors?.['titleBar.activeForeground'] ?? $currentTheme?.fg ?? $currentTheme?.colors?.['titleBar.activeForeground']}] focus:bg-[${$currentTheme?.colors?.['titleBar.activeForeground']}] hover:text-[${$currentTheme?.colors?.['titleBar.activeBackground']}] focus:text-[${$currentTheme?.colors?.['titleBar.activeBackground']}]`)}" type="button" aria-label="Toggle lamy debugbar">
                    {#if $collapsibleOpen}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x {tw('w-6 h-6')}">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lucide lucide-chevrons-up-down {tw('w-6 h-6')}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- {#if $collapsibleOpen} -->
                <!-- transition:slide={{ easing: cubicInOut }} -->
                <!-- https://chriscoyier.net/2022/12/21/things-css-could-still-use-heading-into-2023/#animate-to-auto -->
                <!-- transition-all duration-300 ease-linear -->
                <div use:melt={$collapsibleContent} class="lamy-tabscontent-container {tw('max-h-96 border-t border-gray-700 overflow-x-hidden overflow-y-hidden')} {tw('grid')} {tw(`${$collapsibleOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`)}">
                    {#key highlighter.themes?.at(0)}
                        {#each Object.entries(data) as [key, value] (key)}
                            <!-- transition-all duration-300 ease-linear -->
                            <div use:melt={$tabsContent(key)} style:--tab="tab-{key}" class="lamy-tabscontent-item {tw('min-h-0 grid overflow-y-auto')} {tw(`${$currentTab === key && $collapsibleOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`)}">
                                <div class="{tw('min-h-0')}">
                                    {@html $shiki?.codeToHtml(JSON.stringify(value, null, 2),
                                    /** @type {import('shikiji').CodeToHastOptions<import('shikiji').BuiltinLanguage, import('shikiji').BuiltinTheme>} */
                                    ({
                                        lang: 'javascript',
                                        theme: $currentTheme?.name,
                                        transformers: [
                                            {
                                                pre(node) {
                                                    addClassToHast(node, tw('overflow-x-auto px-4 py-4'))
                                                }
                                            }
                                        ]
                                    }) )}
                                </div>
                            </div>
                        {/each}
                    {/key}
                </div>
            <!-- {/if} -->
        </div>
    </div>
{:else}
    <div class="{tw('fixed bottom-0 inset-x-0')}">
        <Pulse />
    </div>
{/if}

<style lang="postcss">
    /* TODO: Respect users reduced motion preference */
    /* .lamy-tabscontent-item {
        transition: all 300ms linear;
    }
    @media (prefers-reduced-motion) {
        .lamy-tabscontent-item {
            transition: none;
        }
    } */
    /* .lamy-tabscontent-item {
        view-transition-name: var(--tab);
    } */
    /* ::view-transition-old(var(--tab)),
    ::view-transition-new(var(--tab)) {
        opacity: 1;
        animation-duration: 10s;
    } */
    /* ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 5s;
    } */
    /* @media (prefers-reduced-motion) {
        ::view-transition-group(*),
        ::view-transition-old(*),
        ::view-transition-new(*) {
            animation: none !important;
        }
    } */
</style>
