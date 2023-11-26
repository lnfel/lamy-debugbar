<script>
    import { createSelect, melt } from '@melt-ui/svelte'
    import { fade } from 'svelte/transition'

    export let inputLabel = 'Select'
    export let description = ''
    /**
     * @description Options can be either:
     * - Array of strings
     * - Array of objects
     * - Object with array of string values for each key
     * - Object with array of object values for each key
     * 
     * @type {String[] | { label: String, value: String }[] | Record<String, String[] | { label: String, value: String }[]>}
     */
    export let options = []
    export let defaultSelected = undefined
    export let value = undefined
    export let valueRaw = undefined
    export let selectedInfo = ''
    export let horizontal = false
    export let placeholder = 'Select'
    export let classWidth = '' // md:min-w-[10rem]
    export let noLabel = false
    export let sameWidth = true

    const { 
        elements: { trigger, menu, option, group, groupLabel, label },
        states: { selectedLabel, open, selected },
        helpers: { isSelected },
    } = createSelect({
        forceVisible: true,
        positioning: {
            placement: 'bottom',
            fitViewport: true,
            sameWidth
        },
        defaultSelected
    })

    $: value = typeof $selected?.value === 'string' ? $selected.value.toLowerCase() : $selected?.value
    $: valueRaw = $selected
</script>

<!-- block w-full max-w-sm md:max-w-lg mx-auto bg-sky-100 text-sky-900 text-sm rounded-md shadow-sm outline-none ring-2 ring-sky-300 dark:ring-sky-100 focus:ring-sky-500 focus:dark:ring-sky-100 border-2 border-transparent focus:dark:border-sky-500 px-4 py-[.423rem] -->
<div class="flex {horizontal ? 'flex-col md:flex-row md:items-center justify-between w-full' : `flex-col ${classWidth ? classWidth : 'max-w-fit'}`} gap-1">
    <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
    <label class="block text-blue-900 {noLabel ? 'hidden' : ''}" use:melt={$label}>
        <span class="flex {horizontal ? 'flex-col justify-center' : 'items-center justify-between gap-4'}">
            <span class="text-sm font-medium text-blue-900">
                <div>{ inputLabel }</div>
                <small>{ description }</small>
            </span>
            <small>
                { selectedInfo }
            </small>
        </span>
    </label>
    <button use:melt={$trigger} aria-label={inputLabel} class="{classWidth} flex items-center justify-between rounded-md text-sm text-slate-800 bg-sky-100 outline-none ring-2 ring-sky-300 dark:ring-sky-100 focus:ring-sky-500 focus:dark:ring-sky-100 border-2 border-transparent hover:dark:border-sky-400 focus:dark:border-sky-500 px-2 py-1 gap-2">
        {$selectedLabel || placeholder}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    {#if $open}
        <div use:melt={$menu} transition:fade={{ duration: 150 }} class="z-10 flex max-h-32 flex-col overflow-y-auto rounded-md bg-white border border-slate-400 p-1 shadow focus:!ring-0 space-y-1">
            {#if options instanceof Array}
                {#each options as item}
                    {#if typeof item === 'string'}
                        <div use:melt={$option({ value: item, label: item })} class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-sm text-slate-800 focus:z-10 focus:text-sky-700 data-[highlighted]:bg-sky-50 data-[selected]:bg-sky-100 data-[highlighted]:text-blue-900 data-[selected]:text-blue-900">
                            <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <span class="whitespace-nowrap">{ item }</span>
                        </div>
                    {/if}
                    {#if typeof item === 'object'}
                        <div use:melt={$option({ value: item.value, label: item.label })} class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-sm text-slate-800 focus:z-10 focus:text-sky-700 data-[highlighted]:bg-sky-50 data-[selected]:bg-sky-100 data-[highlighted]:text-blue-900 data-[selected]:text-blue-900">
                            <div class="check {$isSelected(item.value) ? 'block' : 'hidden'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <span class="whitespace-nowrap">{ item.label }</span>
                        </div>
                    {/if}
                {:else}
                    <div class="relative cursor-pointer rounded-md py-1 pl-2 pr-4 text-neutral-800 focus:z-10 focus:text-sky-700 data-[highlighted]:bg-sky-50 data-[selected]:bg-sky-100 data-[highlighted]:text-blue-900 data-[selected]:text-blue-900">
                        No options
                    </div>
                {/each}
            {:else}
                {#each Object.entries(options) as [key, arr]}
                    <div use:melt={$group(key)}>
                        <div use:melt={$groupLabel(key)} class="py-1 pl-4 pr-4 font-semibold capitalize text-sm text-neutral-800">
                            { key }
                        </div>
                        {#each arr as item}
                            {#if typeof item === 'string'}
                                <div use:melt={$option({ value: item, label: item })} class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-sm text-slate-800 focus:z-10 focus:text-sky-700 data-[highlighted]:bg-sky-50 data-[selected]:bg-sky-100 data-[highlighted]:text-blue-900 data-[selected]:text-blue-900">
                                    <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    { item }
                                </div>
                            {/if}
                            {#if typeof item === 'object'}
                                <div use:melt={$option({ value: item.value, label: item.label })} class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-sm text-slate-800 focus:z-10 focus:text-sky-700 data-[highlighted]:bg-blue-50 data-[selected]:bg-blue-100 data-[highlighted]:text-blue-900 data-[selected]:text-blue-900">
                                    <div class="check {$isSelected(item.value) ? 'block' : 'hidden'}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <span class="whitespace-nowrap">{ item.label }</span>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/each}
            {/if}
                
        </div>
    {/if}
</div>

<style lang="postcss">
    .check {
      position: absolute;
      left: theme(spacing.2);
      top: 50%;
      z-index: theme(zIndex.20);
      translate: 0 calc(-50% + 1px);
      color: theme(colors.blue.500);
    }
</style>
