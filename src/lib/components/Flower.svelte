<script>
    import LamyIcon from "$lib/assets/lamy-logo-192x192.png"
    import { tw } from "$lib/twind.js"
</script>

<div>
    <img src={LamyIcon} alt="Lamy Debugbar icon" width="40" height="40" class={`${tw('max-h-10 object-contain py-2')}`}>
    <span class={`lamy-summary-text ${tw('sr-only')}`}>Lamy Debugbar</span>
</div>