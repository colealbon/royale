'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
export default function notPGPContent(content) {
    return (!content) ?
    () => notEmpty(content):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject(new Error('missing openpgp')):
        new Promise((resolve, reject) => {
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                reject(new Error('PGP content'));
            } else {
                try {
                    openpgp.message.readArmored(content)
                    reject(new Error('PGP content'));
                } catch (err) {
                    resolve(content);
                }
            }
        })
    }
};
