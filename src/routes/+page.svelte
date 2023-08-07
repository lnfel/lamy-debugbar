<script>
    import { page } from '$app/stores'
    // import LamyDebugbar from 'lamy-debugbar'
    // import LamyDebugbar from "lamy-debugbar/dist/components/LamyDebugbar.svelte"
    // import LamyDebugbar from "$lib/components/LamyDebugbar.svelte"
    import LamyDebugbar from '$lib/components/LamyDebugbar.svelte'
    import Code from "$lib/components/Code.svelte"
    import Link from "$lib/components/Link.svelte"
    import SSRB from "$lib/components/SSRB.svelte"
    import Flower from "$lib/components/Flower.svelte"
    // import Pulse from "$lib/components/Pulse.svelte"

    const themes = ['css-variables', 'dark-plus', 'dracula-soft', 'dracula', 'github-dark-dimmed', 'github-dark', 'github-light', 'hc_light', 'light-plus', 'material-darker', 'material-default', 'material-lighter', 'material-ocean', 'material-palenight', 'min-dark', 'min-light', 'monokai', 'nord', 'one-dark-pro', 'poimandres', 'rose-pine-dawn', 'rose-pine-moon', 'rose-pine', 'slack-dark', 'slack-ochin', 'solarized-dark', 'solarized-light', 'vitesse-dark', 'vitesse-light']
    /**
     * @type {String}
     */
    let selectedTheme = 'material-palenight'
    let open = false
    let noIcon = false
    let sampleData = {...$page}
    let pokemon = ""
    /** @type {any} */
    let tokyoNight
    let customIcon = false

    let promise = new Promise((resolve, reject) => {
        resolve({})
    })

    const reloadDebugbar = async () => {
        tokyoNight = null

        promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve({}), 1000)
        })
    }

    const catchPokemon = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLocaleLowerCase()}`)
            const body = await response.json()
            sampleData = pokemon !== ""
                ? Object.assign(sampleData, { [pokemon]: body })
                : Object.assign(sampleData, { 'pokédex': body })
        } catch (error) {
            console.log('We failed to catch the Pokémon.')
        }
    }

    const fetchDummyProduct = async () => {
        try {
            const response = await fetch('https://dummyjson.com/products/1')
            const body = await response.json()
            sampleData = Object.assign(sampleData, { product: body })
        } catch (error) {
            console.log('No booty found.')
        }
    }

    const loadTokyoNight = async () => {
        const response = await fetch('/shiki/themes/tokyo-night-color.json')
        tokyoNight = await response.json()
    }
</script>

<header class="container mx-auto px-4 lg:px-24 py-8 transition-all space-y-4">
    <h1 class="max-w-4xl mx-auto text-sky-500 text-4xl font-bold tracking-wider">Lamy Debugbar</h1>
    <p class="max-w-4xl mx-auto">The missing <a href="https://svelte.dev/" class="text-[#ff531a] outline-none hover:underline focus:underline">Svelte</a> debugbar, inspired by <a class="text-[#eb4432] outline-none hover:underline focus:underline" href="https://github.com/barryvdh/laravel-debugbar">Laravel Debugbar</a>.</p>
</header>

<main class="container mx-auto px-4 lg:px-24 space-y-6 transition-all">
    <section class="py-24">
        <div class="space-y-4">
            <label for="theme" class="block w-full max-w-sm md:max-w-lg mx-auto font-medium text-gray-700 dark:text-white">
                Powered by <a href="https://shiki.matsu.io/" class="text-[#6f92ba] outline-none shiki-link">Shiki</a> we can choose from {themes.length} awesome themes!
            </label>
            <select id="theme" on:change={reloadDebugbar} bind:value={selectedTheme} class="block w-full max-w-sm md:max-w-lg mx-auto bg-sky-100 text-sky-900 text-sm rounded-md shadow-sm outline-none ring-2 ring-sky-300 dark:ring-sky-100 focus:ring-sky-500 focus:dark:ring-sky-100 border-2 border-transparent focus:dark:border-sky-500 px-4 py-[.423rem]">
                {#each themes as theme}
                    <option value={theme}>{theme}</option>
                {/each}
            </select>
        </div>
    </section>

    <section class="w-full max-w-4xl mx-auto space-y-4">
        <h2 class="font-medium text-gray-700 dark:text-white">Try things out</h2>
        <div class="flex flex-wrap items-center lg:justify-between gap-4">
            <div class="flex items-center gap-2 pl-1">
                <input type="checkbox" id="open" bind:checked={open} class="appearance-none outline-none w-4 h-4 rounded bg-sky-100 border border-sky-500 ring-2 ring-transparent ring-offset-2 dark:ring-offset-sky-dark focus:ring-sky-500 dark:focus:ring-sky-500">
                <label for="open" class="text-sm font-medium text-gray-700 dark:text-white">
                    <span>Keep open</span>
                </label>
            </div>

            <div class="flex items-center gap-2 pl-1">
                <input type="checkbox" id="noIcon" bind:checked={noIcon} class="appearance-none outline-none w-4 h-4 rounded bg-sky-100 border border-sky-500 ring-2 ring-transparent ring-offset-2 dark:ring-offset-sky-dark focus:ring-sky-500 dark:focus:ring-sky-500">
                <label for="noIcon" class="text-sm font-medium text-gray-700 dark:text-white">
                    <span>No icon</span>
                </label>
            </div>

            <div class="flex items-center gap-4">
                <button on:click={catchPokemon} type="button" class="whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
                    Bring up Pokédex
                </button>
                <!-- <button on:click={catchPokemon} type="button" class="whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
                    Fetch for Pokémon
                </button> -->
                <!-- <input type="text" placeholder="Pikachu (Huge data)" bind:value={pokemon}
                    class="block w-full bg-sky-100 autofill:shadow-fill-white autofill:text-fill-gray-900 autofill:dark:shadow-fill-sky-100 autofill:dark:text-fill-sky-900 text-sky-900 text-sm rounded-md shadow-sm outline-none ring-2 ring-sky-300 dark:ring-sky-100 focus:ring-sky-500 focus:dark:ring-sky-100 border-2 border-transparent focus:dark:border-sky-500 px-2 leading-7"> -->
            </div>

            <div class="flex items-center gap-2">
                <button on:click={fetchDummyProduct} type="button" class="whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
                    Fetch Dummy Product (small data)
                </button>
            </div>

            <div class="flex items-center gap-2">
                <button on:click={loadTokyoNight} type="button" class="whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
                    Custom theme TokyoNight
                </button>
            </div>

            <!-- <div class="flex items-center gap-2">
                <button on:click={() => customIcon = !customIcon} type="button" class="flex items-center gap-2 whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
                    <img src="images/ssrb-192x192.webp" alt="SSRB" class="w-6 h-6" />
                    <span>Toggle Custom Icon</span>
                </button>
            </div> -->

            <div class="flex items-center gap-2 pl-1">
                <input type="checkbox" id="customIcon" bind:checked={customIcon} class="appearance-none outline-none w-4 h-4 rounded bg-sky-100 border border-sky-500 ring-2 ring-transparent ring-offset-2 dark:ring-offset-sky-dark focus:ring-sky-500 dark:focus:ring-sky-500">
                <label for="customIcon" class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                    <img src="images/ssrb-192x192.webp" alt="SSRB" class="w-6 h-6" />
                    <span>Custom Icon</span>
                </label>
            </div>

            <!-- <div>
                <a href="/about">About</a>
            </div> -->
        </div>
    </section>

    <section class="max-w-4xl mx-auto py-6 space-y-4">
        <h2 class="text-sky-500 text-3xl font-bold tracking-wider">Motivation</h2>
        <p>I was using this awesome svelte package called <Link href="https://github.com/ciscoheat/sveltekit-superforms">sveltekit-superforms</Link> for validating data from obviously form input data. It has this component called <a href="https://github.com/ciscoheat/sveltekit-superforms/wiki/API-reference#superdebug"><Code>SuperDebug</Code></a> which let's you visualize your debugging process called GSD (Get shit dumped). I know, it's awesome, this takes console logging to a next level by dumping all the sensitive data visually on the web page. The project manager now has a reason to blame you when things get leaked after the next release. I was impressed by the idea so I took some time to enhance the layout for <Code>SuperDebug</Code> and made a <Link href="https://github.com/ciscoheat/sveltekit-superforms/pull/38">pull request #38</Link>. Then a realization hit me, "What if we take one step ahead and make this a debugbar like laravel-debugbar?" At that moment, <Code>LamyDebugbar</Code> component was born.</p>
    </section>
</main>

<footer class="container mx-auto flex items-center justify-between text-xs px-4 lg:px-24 py-12">
    <span>Copyright &copy; 2023 <Link href="https://lnfel.github.io/portfolio/">lnfel</Link></span>
    <span>This project is a tribute to <Link href="https://www.youtube.com/@YukihanaLamy">Yukihana Lamy</Link></span>
</footer>

<!-- {#if selectedTheme} -->
    <!-- {#await promise}
        <div class="fixed bottom-0 inset-x-0">
            <Pulse />
        </div>
    {:then result}
        <LamyDebugbar bind:open highlighter={{
            theme: `${selectedTheme}`
        }} bind:data={sampleData}/>
    {/await} -->
<!-- {/if} -->


{#if tokyoNight}
    <LamyDebugbar bind:open bind:data={sampleData} bind:noIcon bind:customTheme={tokyoNight} />
{:else}
    <LamyDebugbar bind:open bind:data={sampleData} highlighter={{
        theme: `${selectedTheme}`
    }} bind:noIcon>
        <svelte:component slot="icon" this={customIcon ? SSRB : Flower} />
    </LamyDebugbar>
{/if}

<style>
    input[type="checkbox"]:checked {
        background-image: url("data:image/svg+xml;charset=utf-8,<svg viewBox='0 0 16 16' fill='rgb(14 165 233)' xmlns='http://www.w3.org/2000/svg'><path d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z'/></svg>");
    }
    .shiki-link {
        position: relative;
        text-decoration: none;
        color: #6f92ba;
        transition: color .4s;
    }
    .shiki-link::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: #6f92ba;
        transform: scaleX(0);
        transition: all 0.2s cubic-bezier(.82, 0, .12, 1) 0s;
    }
    .shiki-link:hover::before,
    .shiki-link:focus::before {
        visibility: visible;
        transform: scaleX(1);
    }
</style>