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
                        determineContentType(openpgp)(content)
                        .then(contentType => {
                            console.log('contentType: ', contentType)
                            if (contentType === CLEARTEXT) {
                                encryptCleartextMulti(openpgp)(localStorage)(content)
                                .then((encrypted) => {
                                    console.log('encrypted:', encrypted)
                                    broadcastMulti(openpgp)(gundb)(encrypted)
                                    .then((result) => {
                                        console.log('broadcastMulti:', result);
                                        resolve(result);
                                    })
                                    .catch((error) => reject(error));
                                })
                                .catch((error) => reject(error));
                            }
                            if (contentType === PGPPRIVKEY) {
                                savePGPPrivkey(openpgp)(localStorage)(content)
                                .then(result => resolve(result))
                            }
                            if (contentType === PGPPUBKEY) {
                                savePGPPubkey(openpgp)(localStorage)(content)
                                .then(result => {
                                    console.log(result);
                                    resolve(result)
                                })
                            }
                            if (contentType === PGPMESSAGE) {
                                broadcast(openpgp)(gun)(content)
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
