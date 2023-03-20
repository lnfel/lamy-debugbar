/**
 * Copy package.json to package output directory
 * 
 * https://github.com/sveltejs/kit/pull/8922
 */

import { writeFileSync, readFileSync } from 'node:fs'

// read file into JSON
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
console.log('Re-mapping exports.')

for (const property in pkg.exports) {
    if (pkg.exports[property] instanceof Object) {
        console.log(`"${property}":`)
        for (const map in pkg.exports[property]) {
            console.log(`    ${map}: ${pkg.exports[property][map]}`)
            pkg.exports[property][map] = pkg.exports[property][map].replace('/dist', '')
        }
    }
}

console.log('Re-mapped exports.')
console.log(pkg.exports)

// adjust pkg json however you like ..

// write it to your output directory
writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 4))