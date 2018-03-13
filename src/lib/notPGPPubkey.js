'use strict';
let memoize = require('memoizee');

import notEmpty from '../../src/lib/notEmpty.js';
let slow_notPGPPubkey = function (openpgp) {
    return (!openpgp) ?
    Promise.reject(new Error('missing openpgp')):
    (content) => {
        return (!content) ?
        notEmpty(content):
        new Promise((resolve, reject) => {
            try {
                let pgpKey = openpgp.key.readArmored(content).keys[0];
                if (pgpKey.toPublic().armor() !== pgpKey.armor()) {
                    resolve(content);
                } else {
                    reject(new Error('PGP Pubkey content'));
                }
            }
            catch (error) {
                resolve(content);
            }
        });
    }
};

let notPGPPubkey = memoize(slow_notPGPPubkey, { promise: true });
export default notPGPPubkey;
