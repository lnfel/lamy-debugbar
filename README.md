<p align="center">
    <a href="https://lnfel.github.io/lamy-debugbar/" target="_blank">
        <img src="https://raw.githubusercontent.com/lnfel/lamy-debugbar/main/src/lib/assets/lamy-logo.png" height="100">
    </a>
    <h1 align="center">lamy-debugbar</h1>
</p>

<div align="center">
  <p>
    The missing Svelte debugbar, inspired by Laravel Debugbar.
  </p>
  <br/>
  <a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</div>

## About

Lamy Debugbar is an elegant Svelte component that can replace `{JSON.stringify(data}` dumps on the client-side. Talk about a fancier way to get ~~shit~~ things done. The component is powered by [Shiki](https://shiki.matsu.io/), making sure that data being debugged can be as readable as possible, it's like reading code in your favourite text editor! Now that's what I call developer experience.

For a quick showcase please visit [lamy-debugbar's github page](https://lnfel.github.io/lamy-debugbar/).

## Installation

```s
npm i lamy-debugbar
```

## Getting Started

Simply import LamyDebugbar component and supply the data you wish to be displayed.

**src/routes/+page.js**
```svelte
<script>
    import { page } from '$app/stores'
    import LamyDebugbar from "lamy-debugbar"
</script>

<LamyDebugbar data={$page} />
```

The component will then destructure the keys from the `$page` object we pass to it. And will display those key values on their own tab. The tab key will be the title for each corresponding tab. Lamy Debugbar will then have tab for error, params, route, status, url, form and data (as these are the keys immediately held by $page object).

If you already got the gist, this means we can combine multiple data that we need to be displayed by the component.

> Trivia: There is also a long method for importing the component. Why tho? Because we can.

```js
import LamyDebugbar from "lamy-debugbar/dist/components/LamyDebugbar.svelte"
```

### Combining data to be displayed

Refactoring the sample code above we can combine objects and display it with Lamy Debugbar.

**src/routes/+page.js**
```svelte
<script>
    import { page } from '$app/stores'
    import LamyDebugbar from "lamy-debugbar"

    export let data
    let debug = { page: $page, server: data }
</script>

<LamyDebugbar data={debug} />
```

The debugbar will show tab for `page` and `server`. And since we declared `debug` using the `let` keyword, we can update the data in cases where we are fetching data remotely or async.

## Configuration

There are six properties exposed by Lamy Debugbar, data, open, noIcon, highlighter, customTheme and ~~offline~~ as well as one optional slot named icon.

```svelte
<LamyDebugbar 
    data?={any}
    open?={false}
    noIcon?={false}
    highlighter?={{
        theme: 'material-theme-palenight',
        langs: ['javascript']
    }}
    customTheme?={Object}>

    <slot name="icon" />

</LamyDebugbar>
```

### Props

| Prop name | Type | Default value | Description |
| :--- | :--- | :--- | --- |
| data | any | {} | The object that will be displayed by Lamy Debugbar. |
| open | Boolean | false | Whether to keep the debugbar expanded. |
| noIcon | Boolean | false | Whether to display debugbar icon. |
| highlighter | Object | Material theme palenight and javascript language[^1] | Shiki's [HighlighterOptions](https://github.com/shikijs/shiki#configuration-and-options) |
| [customTheme](#loading-up-a-custom-theme) | Object | undefined | Load a custom theme that is not shipped with shiki by default. Examples are [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme/tree/master/themes) and [SynthWave 84](https://github.com/robb0wen/synthwave-vscode/blob/master/themes/synthwave-color-theme.json). Note that shiki only accepts valid JSON syntax and will reject malformed JSON, if you have trouble loading a custom theme, check first to see if the json data is strictly valid. Trailing commas and comments are usually the issue. |

For a list of available themes head to [Shiki's doc about themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md#shiki-themes). And a list of themes not bundled by Shiki can be viewed at [vscodethemes website](https://vscodethemes.com/).

### Slots

| Slot name | Default element | Description |
| :--- | :--- | ---|
| [icon](#loading-up-a-custom-icon) | Lamy Debugbar flower icon[^2] | Define your own custom icon and replace the default flower icon. |

### Loading up a custom theme

In this section I will show how to load a custom theme named [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme/tree/master/themes).

> Note when using `customTheme` prop, the `highlighter` prop should not be used in conjunction of `customTheme`. `highlighter` will still have javascript language loaded by default, since LamyDebugbar only works with JSON data, we don't need anything else.

1. First I took some time to get raw json file of [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme/blob/master/themes/tokyo-night-color-theme.json)
2. Saved it somewhere we can fetched later, in my case I saved it inside `static/shiki/themes/tokyo-night-color.json`
3. If we fetch the json file as is, we are bound to encounter a lot of errors because of JSON syntax alone. I then took my time to remove trailing commas and comments then saved the cleaned up json file. There are tools out there that can automate this trivial task, just google **JSON syntax formatter** or linter.
4. Let's import our custom theme!

```svelte
<script>
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import LamyDebugbar from "$lib/components/LamyDebugbar.svelte"

    /** @type {Object} */
    let customTheme
    onMount(async () => {
        const response = await fetch('/shiki/themes/tokyo-night-color.json')
        // Note that we get Object representation of JSON data and not a string.
        // If you are loading JSON as string, use JSON.parse to convert it to Object.
        customTheme = await response.json()
    })
</script>

<LamyDebugbar data={{...$page}} customTheme={customTheme} />
```

### Loading up a custom icon

Not a fan of flowers? Not a problem since you can just either remove displaying icon using `noIcon` prop or replace it with your own using `component slot` named `icon`.

```svelte
<script>
    import { page } from '$app/stores'
</script>

<LamyDebugbar bind:data={{...$page}} highlighter={{
    theme: `min-dark`
}}>
    <img slot="icon" src="/images/ssrb-192x192.webp" alt="SSRB" width="40" height="40" />
</LamyDebugbar>
```

<details>
<summary>Using debugbar offline (Deprecated, themes are now included as modules.)</summary>

By default, shiki themes, language and oniguruma wasm engine is fetched from a [CDN](https://cdn.jsdelivr.net/npm/shiki-es@latest/dist/assets/). This is good as we don't need to manage the themes and language ourselves. As part of progressive enhancement the `offline` prop allows users to use Lamy Debugbar even in dire circumstances, such as when coding without internet.

```svelte
<script>
    import { page } from '$app/stores'
</script>

<LamyDebugbar bind:data={{...$page}} offline={true} highlighter={{
    theme: `min-dark`
}} />
```

Enabling this prop however, will require your app to host the necessary themes and languages as well as the oniguruma wasm file needed by shiki to function. Lamy Debugbar will look for shiki themes inside `shiki/themes`, language files inside `shiki/languages` and oniguruma wasm engine at `shiki/onig.wasm`. Here is an example on how rose-pine-dawn theme and javascript language is hosted on my own sveltekit app:

```s
awesome-project/
├─ src/
├─ static/
│  ├─ shiki/
│  │  ├─ themes/
│  │  │  ├─ rose-pine-dawn.json
│  │  ├─ languages/
│  │  │  ├─ javascript.tmLanguage.json
│  │  ├─ onig.wasm
```

The themes, languages and onig.wasm files can be downloaded from [shiki-es CDN](https://cdn.jsdelivr.net/npm/shiki-es@latest/dist/assets/).
</details>

## Roadmap

Roadmap has been moved to [project board](https://github.com/users/lnfel/projects/1).

Due to how themes work, there is no unified way of getting the right color combination for lamy debugbar at the moment, some themes will not be as good when used due to certain theming tokens not present. Old themes usually have this issue. Newer themes are much more compliant with new vscode theming.

- [ ] ~~Find a way for users to set color scheme based on current theme pallete chosen. Shiki has this css-variables feature which might be the one we are looking to consider using.~~ [Shikiji 式辞 drops support for css-variables](https://github.com/antfu/shikiji#hard-breaking-changes).

[^1]: Default highlighter options
    ```js
        {
            theme: 'material-theme-palenight',
            langs: ['javascript']
        }
    ```

[^2]: Default Lamy Debugbar icon
    ```html
    <div>
        <img src="http://localhost:5173/src/lib/assets/lamy-logo-192x192.png" alt="Lamy Debugbar icon" width="40" height="40" class="max-h-10 object-contain py-2">
        <span class="lamy-summary-text sr-only">Lamy Debugbar</span>
    </div>
    ```