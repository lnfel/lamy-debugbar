import { getHighlighter } from 'shiki-es'

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
 * Initialize Shiki highlighter
 * 
 * @param {Object} highlighterOptions getHighlighter options
 * @see {getHighlighter} shiki-es getHighlighter
 * @returns {Promise<import('shiki-es').Highlighter>} shiki-es Highlighter
 */
export const shikiHighlighter = async (highlighterOptions = {}) => {
    const defaultHighlighterOptions = {
        theme: 'material-palenight',
        langs: ['javascript']
    }
    highlighterOptions = Object.assign(defaultHighlighterOptions, highlighterOptions)
    return await getHighlighter(highlighterOptions)
}

/**
 * @returns {Promise<Shiki>}
 */
export default class Shiki {
    /**
     * @constructor
     * @param {Function} highlighter 
     * @param {Object} highlighterOptions 
     */
    constructor(highlighter, highlighterOptions) {
        // /**
        //  * @type {Promise<import('shiki-es').Highlighter>}
        //  */
        // this.highlighter = this.init(highlighter, highlighterOptions)

        // @ts-ignore
        return (async () => {
            this.highlighter = await highlighter(highlighterOptions)

            return this
        })()
    }

    /**
     * Async function constructor
     * 
     * https://stackoverflow.com/a/54737471/12478479
     * 
     * @param {Function} highlighter 
     * @param {Object} highlighterOptions 
     */
    async init(highlighter, highlighterOptions) {
        return await highlighter(highlighterOptions)
    }
}
