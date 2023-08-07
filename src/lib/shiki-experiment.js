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