'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
import notCleartext from '../../src/lib/notCleartext.js';
import notPGPKey from '../../src/lib/notPGPKey.js';

export default function notPGPMessage(openpgp) {
    return (!openpgp) ?
    Promise.reject(new Error('missing openpgp')):
    (content) => {
        return (!content) ?
        notEmpty(content):
        new Promise((resolve, reject) => {
            try {
                notCleartext(content)(openpgp)
                .then(() => {
                    return notPGPKey(content)(openpgp)
                })
                .then(() => {
                    resolve(content)
                })
                .catch((error) => {
                    resolve(content)
                })
            } catch (err) {
                reject(new Error ('PGPMessage content'));
            }
        });
    }
};
