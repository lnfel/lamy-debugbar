<script>
	import { onMount } from "svelte"
    import { page } from "$app/stores"
    import LamyDebugbar from "$lib/components/LamyDebugbar.svelte"

    /** @type {Object} */
    let customTheme
    onMount(async () => {
        const response = await fetch('/shiki/themes/tokyo-night-color.json')
        customTheme = await response.json()
    })
</script>

<LamyDebugbar data={{...$page}} customTheme={customTheme} />