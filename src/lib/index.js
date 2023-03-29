// Reexport your entry components here
// import { SvelteComponentTyped } from "svelte"
/**
 * 1. First export a class that extends SvelteComponentTyped
 * 2. npm run build, it will generate a dist folder for the package with the corresponding types
 * 3. Copy /dist/components/LamyDebugbar.svelte.d.ts to /src/lib/components/LamyDebugbar.svelte.d.ts
 * 4. After copying the types for our component we can now import it safely in this file
 */
// export class LamyDebugbar extends SvelteComponentTyped { }

/**
 * 5. Do the thing, import out component and reexport the thing
 */
import LamyDebugbar from "./components/LamyDebugbar.svelte"
export default LamyDebugbar

// This one also works
// export { default as LamyDebugbar} from "./components/LamyDebugbar.svelte"
