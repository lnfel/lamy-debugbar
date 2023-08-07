import install from '@twind/with-sveltekit'
import config from '$lib/twind.config.js'

install(config)

export const prerender = true
export const trailingSlash = 'always'