'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
export default function notCleartext(content) {
    return (!content) ?
    () => notEmpty(content):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject(new Error('missing openpgp')):
        new Promise((resolve, reject) => {
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                resolve(content)
            } else {
                try {
                    openpgp.message.readArmored(content)
                    resolve(content);
                } catch (err) {
                    reject(new Error('cleartext content'));
                }
            }
        })
    }
};
