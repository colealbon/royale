'use strict';
/*eslint-env node, mocha, es6 */
/* https://bost.ocks.org/mike/shuffle/ */

export function shuffle(array) {
    return (!array) ?
    Promise.reject(new Error('missing array')) :
    new Promise((resolve, reject) => {
        try {
            var m = array.length, t, i;
            while (m) {
              i = Math.floor(Math.random() * m--);
              t = array[m];
              array[m] = array[i];
              array[i] = t;
            }
            resolve(array);
        } catch(error) {
            reject(error);
        }
    });
}
