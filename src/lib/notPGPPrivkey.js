'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
export default function notPGPPubkey(content) {
    return (!content) ?
    () => notEmpty(content):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject(new Error('missing openpgp')):
        new Promise((resolve, reject) => {
            try {
                let pgpKey = openpgp.key.readArmored(content).keys[0];
                if (pgpKey.toPublic().armor() !== pgpKey.armor()) {
                    reject(new Error('PGP Privkey content'));
                } else {
                    resolve(content);
                }
            }
            catch (error) {
                resolve(content);
            }
        });
    }
};
