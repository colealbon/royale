'use strict';

import {determineKeyType} from './determineKeyType.js';

export function determineContentType(openpgp) {
    // usage: determineContentType(openpgp)(content).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (content) => {
        return (!content) ?
        Promise.resolve(''):
        new Promise((resolve, reject) => {
            const CLEARTEXT = 'cleartext';
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
