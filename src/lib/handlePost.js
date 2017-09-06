'use strict';

import {broadcastMulti} from './broadcastMulti.js';
import {encryptCleartextMulti} from './encryptCleartextMulti.js';
import {determineContentType} from './determineContentType.js';
import {savePGPPubkey} from './savePGPPubkey.js';
import {savePGPPrivkey} from './savePGPPrivkey.js';

const PGPPUBKEY = 'PGPPubkey';
const CLEARTEXT = 'cleartext';
const PGPPRIVKEY = 'PGPPrivkey';
const PGPMESSAGE = 'PGPMessage';

export function handlePost(content) {
    return (!content) ?
    Promise.resolve('') :
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (password) => {
                return (gundb) => {
                    return new Promise((resolve, reject) => {
                        determineContentType(content)(openpgp)
                        .then(contentType => {
                            if (contentType === CLEARTEXT) {
                                encryptCleartextMulti(content)(openpgp)(localStorage)
                                .then((encrypted) => {
                                    broadcastMulti(encrypted)(gundb)(openpgp)
                                    .then((result) => {
                                        console.log(result);
                                        resolve(result);
                                    })
                                    .catch((error) => reject(error));
                                })
                            }
                            if (contentType === PGPPRIVKEY) {
                                savePGPPrivkey(content)(openpgp)(localStorage)
                                .then(result => resolve(result))
                            }
                            if (contentType === PGPPUBKEY) {
                                savePGPPubkey(content)(openpgp)(localStorage)
                                .then(result => {
                                    console.log(result);
                                    resolve(result)
                                })
                            }
                            if (contentType === PGPMESSAGE) {
                                broadcast(content)(gun)(openpgp)
                                .then(result => resolve(result))
                            }
                        })
                        .catch((err) => reject(err))
                    })
                }
            }
        }
    }
}
