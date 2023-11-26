<script>
    import { page } from "$app/stores"
    import { base } from '$app/paths'
    import { bundledThemes } from "shikiji"

    import LamyDebugbarShikiji from "$lib/components/LamyDebugbarShikiji.svelte"
    import SSRB from "$lib/components/SSRB.svelte"
    import Flower from "$lib/components/Flower.svelte"

    const themes = Object.keys(bundledThemes)
    let selectedTheme = 'material-theme-palenight'
    /** @type {any} */
    let customTheme

    /**
     * @param {String} path Shiki themes path url
     */
    const loadCustomTheme = async (path) => {
        const response = await fetch(path)
        customTheme = await response.json()
    }

    const reloadDebugbar = async () => {
        customTheme = null
    }

    $: highlighter = {
        themes: [selectedTheme],
        langs: ['javascript']
    }
</script>

<select on:change={reloadDebugbar} id="theme" bind:value={selectedTheme} class="block w-full max-w-sm md:max-w-lg mx-auto bg-sky-100 text-sky-900 text-sm rounded-md shadow-sm outline-none ring-2 ring-sky-300 dark:ring-sky-100 focus:ring-sky-500 focus:dark:ring-sky-100 border-2 border-transparent focus:dark:border-sky-500 px-4 py-[.423rem]">
    {#each themes as theme}
        <option value={theme}>{theme}</option>
    {/each}
</select>

<div class="flex items-center gap-2">
    <button on:click={() => loadCustomTheme(`${base}/shiki/themes/tokyo-night-color.json`)} type="button" class="whitespace-nowrap text-base font-medium rounded-md shadow-sm text-white dark:text-sky-900 dark:focus:text-white bg-sky-500 dark:bg-sky-300 dark:focus:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-200 focus:outline-none focus:ring-2 dark:focus:ring-0 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-sky-500 border-2 border-transparent dark:focus:border-sky-100 px-2 py-1">
        VScode theme Tokyo Night
    </button>
</div>


{#if customTheme}
    <LamyDebugbarShikiji data={$page} open bind:customTheme>
        <svelte:component slot="icon" this={true ? SSRB : Flower} />
    </LamyDebugbarShikiji>
{:else}
    <LamyDebugbarShikiji data={$page} open bind:highlighter>
        <svelte:component slot="icon" this={false ? SSRB : Flower} />
    </LamyDebugbarShikiji>
{/if}
