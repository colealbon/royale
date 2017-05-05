'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
export default function notPGPKey(content) {
    return (!content) ?
    () => notEmpty(content):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject(new Error('missing openpgp')):
        new Promise((resolve, reject) => {
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                reject(new Error('PGP key'));
            } else {
                resolve(content);
            }
        })
    }
};
