'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
export default function notPGPPrivkey(openpgp) {
    return (!openpgp) ?
    Promise.reject(new Error('missing openpgp')):
    (content) => {
        return (!content) ?
        notEmpty(content) :
        new Promise((resolve, reject) => {
            try {
                let pgpKey = openpgp.key.readArmored(content).keys[0];
                if (pgpKey.toPublic().armor() !== pgpKey.armor()) {
                    reject(new Error('PGP Privkey content'));
                }
                resolve(content);
            }
            catch (error) {
                resolve(content);
            }
        });
    }
};
