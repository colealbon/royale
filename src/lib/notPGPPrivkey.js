'use strict';
let memoize = require('memoizee');
import notEmpty from '../../src/lib/notEmpty.js';

let slow_notPGPPrivkey = function (openpgp) {
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

let notPGPPrivkey = memoize(slow_notPGPPrivkey, { promise: true });

export default notPGPPrivkey;
