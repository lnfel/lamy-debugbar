import { getHighlighter, toShikiTheme, renderToHtml, setCDN, setWasm } from 'shiki-es'

/**
 * Host the onig.wasm file, loading from CDN is slow af
 * 
 * On second thought it's best to use the cdn as we can import any theme users want
 * 
 * First copy node_modules/shiki-es/dist/assets/dist/onig.wasm to static/onig.wasm
 * cp node_modules/shiki-es/dist/assets/dist/onig.wasm static/shiki/onig.wasm
 */
export const loadWASM = async () => {
    const onigurumaWASM = await fetch('/shiki/onig.wasm')
    return onigurumaWASM
}

/**
 * @type {import('shiki-es').HighlighterOptions}
 */
export const defaultHighlighterOptions = {
    theme: 'material-theme-palenight',
    langs: ['javascript']
}

/**
 * Initialize Shiki highlighter
 * 
 * @param {Object} highlighterOptions getHighlighter options
 * @see {getHighlighter} shiki-es getHighlighter
 * @returns {Promise<import('shiki-es').Highlighter>} shiki-es Highlighter
 */
export const shikiHighlighter = async (highlighterOptions = {}) => {
    highlighterOptions = Object.assign(defaultHighlighterOptions, highlighterOptions)
    return await getHighlighter(highlighterOptions)
}

class Shiki {
    /** @type {import('shiki-es').Highlighter | undefined} */
    highlighter

    toShikiTheme = toShikiTheme
    renderToHtml = renderToHtml

    /**
     * @constructor
     * @param {import('shiki-es').HighlighterOptions} highlighterOptions 
     */
    constructor(highlighterOptions = {}) {
        this.highlighterOptions = highlighterOptions
    }

    /**
     * @param {import('shiki-es').HighlighterOptions} highlighterOptions 
     * @returns {Promise<import('shiki-es').Highlighter>} Highlighter
     */
    async getHighlighter(highlighterOptions = {}) {
        this.highlighter = await getHighlighter(Object.assign(defaultHighlighterOptions, highlighterOptions))
        return this.highlighter
    }

    /**
     * Set the route for loading the assets
     * 
     * URL should end with `/`
     * 
     * For example:
     * ```js
     * setCDN('https://unpkg.com/shiki/') // use unpkg
     * setCDN('/assets/shiki/') // serve by yourself
     * ```
     * 
     * @param {String} root 
     * @returns {void}
     */
    setCDN(root) {
        setCDN(root)
    }

    /**
     * Explicitly set the source for loading the oniguruma web assembly module.
     * 
     * Accepts ArrayBuffer or Response (usage of string is deprecated)
     * 
     * @param {ArrayBuffer | Response} data 
     * @returns {void}
     */
    setWasm(data) {
        setWasm(data)
    }
}

export default new Shiki()

// (async () => {
//     const shiki = new Shiki(defaultHighlighterOptions)
//     await shiki.getHighlighter()

//     // const customThemeJSON = await readFile('static/shiki/themes/tokyo-night-color.json', { encoding: 'utf8' })
//     const customThemeJSON = await readFile('static/shiki/themes/synthwave-color-theme.json', { encoding: 'utf8' })
//     const customTheme = shiki.toShikiTheme(JSON.parse(customThemeJSON))
//     console.log(customTheme)
//     await shiki.highlighter?.loadTheme(customTheme)

//     await shiki.highlighter?.loadTheme('monokai')

//     const theme = shiki.highlighter?.getTheme(customTheme.name)

//     console.log(shiki)
//     console.log(shiki.highlighter?.getLoadedThemes())
//     console.log(shiki.highlighter?.getLoadedLanguages())
//     console.log(theme)
// })()
