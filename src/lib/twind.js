/**
 * Using Twind in library mode
 * 
 * https://twind.style/library-mode
 * 
 * This mode may be useful for component libraries that do not want to expose the twind API to their users.
 * Instead a own twind instance is created and used to generate the styles.
 */
import {
    twind,
    virtual,
    cssom,
    tx as tx$,
    injectGlobal as injectGlobal$,
    keyframes as keyframes$,
} from '@twind/core'

import config from './twind.config.js'
// @ts-ignore
export const tw = /* #__PURE__ */ twind(
    config,
    // support SSR and use a different selector to not get the twind default style sheet
    typeof document === 'undefined' ? virtual() : cssom('style[data-library]'),
)
export const tx = /* #__PURE__ */ tx$.bind(tw)
export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw)
export const keyframes = /* #__PURE__ */ keyframes$.bind(tw)