'use strict';

import {decryptPGPMessage} from './decryptPGPMessage.js';
import {determineContentType} from './determineContentType.js';
import {savePGPPubkey} from './savePGPPubkey.js';

const PGPPUBKEY = 'PGPPubkey';
const CLEARTEXT = 'cleartext';
const PGPPRIVKEY = 'PGPPrivkey';
const PGPMESSAGE = 'PGPMessage';

export function handleMessage(content) {
    return (!content) ?
    Promise.resolve('') :
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (password) => {
                return () => {
                    return new Promise((resolve, reject) => {
                        determineContentType(content)(openpgp)
                        .then(contentType => {
                            console.log(contentType)
                            if (contentType === PGPPUBKEY) {
                                // save to localStorage
                                savePGPPubkey(content)(openpgp)(localStorage)
                                .then(result => resolve(result))
                                .catch((error) => reject(error));
                            } else if (contentType === PGPMESSAGE) {
                                // get PGPKeys, decrypt,  and return
                                decryptPGPMessage(openpgp)(localStorage)(password)(content)
                                .then(result => {
                                    console.log(result);
                                    resolve(result)
                                })
                                .catch((error) => reject(error));
                            } else {
                                resolve();
                            }
                        })
                        .catch((err) => reject(err))
                    })
                }
            }
        }
    }
}
