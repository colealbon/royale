'use strict';
/*eslint-env node, mocha, es6 */

export function deck(content) {
    return new Promise((resolve, reject) => {
        try {
            const thedeck = require('../../public/deck.json');
            resolve(thedeck);
        } catch(error) {
            reject(error);
        }
    });
}
