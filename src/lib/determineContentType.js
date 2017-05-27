'use strict';

import {determineKeyType} from './determineKeyType.js';

export function determineContentType(content) {
    // usage: determineContentType(content)(openpgp).then(result => result)
    return (!content) ?
    Promise.resolve(''):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        new Promise((resolve, reject) => {
            // const PGPPUBKEY = 'PGPPubkey';
            const CLEARTEXT = 'cleartext';
            // const PGPPRIVKEY = 'PGPPrivkey';
            const PGPMESSAGE = 'PGPMessage';
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                determineKeyType(content)(openpgp)
                .then((keyType) => {
                    resolve(keyType);
                });
            } else {
                try {
                    openpgp.message.readArmored(content);
                    resolve(PGPMESSAGE);
                } catch (err) {
                    resolve(CLEARTEXT);
                }
            }
        })
    }
}
