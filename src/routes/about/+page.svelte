<script>
    import { page } from '$app/stores'
    // import LamyDebugbar from 'lamy-debugbar'
    import LamyDebugbar from "$lib/components/LamyDebugbar.svelte"
    import Pulse from "$lib/components/Pulse.svelte"
    import { base } from "$app/paths"

    let sampleData = {...$page}
    let promise = new Promise((resolve, reject) => {
        resolve({})
    })
</script>

<a href="{base}/" class="!text-malibu-500">Home</a>

<LamyDebugbar bind:data={sampleData} highlighter={{
    themes: ["min-dark"]
}}>
    <img slot="icon" src="{base}/images/ssrb-192x192.webp" alt="SSRB" width="40" height="40" />
</LamyDebugbar>

<!-- {#await promise}
    <div class="fixed bottom-0 inset-x-0">
        <Pulse />
    </div>
{:then result}
    <LamyDebugbar highlighter={{
        theme: `min-dark`
    }} bind:data={sampleData}/>
{/await} -->