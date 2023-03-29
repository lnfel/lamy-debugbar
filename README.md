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
    import LamyDebugbar from "lamy-debugbar/dist/components/LamyDebugbar.svelte"
</script>

<LamyDebugbar data={$page} />
```

The component will then destructure the keys from the `$page` object we pass to it. And will display those key values on their own tab. The tab key will be the title for each corresponding tab. Lamy Debugbar will then have tab for error, params, route, status, url, form and data (as these are the keys immediately held by $page object).

If you already got the gist, this means we can combine multiple data that we need to be displayed by the component.

### Combining data to be displayed

Refactoring the sample code above we can combine objects and display it with Lamy Debugbar.

**src/routes/+page.js**
```svelte
<script>
    import { page } from '$app/stores'
    import LamyDebugbar from "lamy-debugbar/dist/components/LamyDebugbar.svelte"

    export let data
    let debug = { page: $page, server: data }
</script>

<LamyDebugbar data={debug} />
```

The debugbar will show tab for `page` and `server`. And since we declared `debug` using the `let` keyword, we can update the data in cases where we are fetching data remotely or async.

## Configuration

There are three properties exposed by Lamy Debugbar, data, open and highlighter.

```svelte
<LamyDebugbar 
    data?={any}
    open?={false}
    highlighter?={{
        theme: 'material-palenight',
        langs: ['javascript']
    }} />
```

| Prop | Type | Default value | Description |
| :--- | :--- | :--- | --- |
| data | any | {} | The object that will be displayed by Lamy Debugbar. |
| open | Boolean | false | Whether to keep the debugbar expanded. |
| highlighter | Object | `{ theme: 'material-palenight', langs: ['javascript'] }` | Shiki's [HighlighterOptions](https://github.com/shikijs/shiki#configuration-and-options) |

For a list of available themes head to Shiki's doc about [themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes).