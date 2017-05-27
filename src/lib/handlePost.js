'use strict';

// import {handlePGPPubkey} from '../../src/lib/util.js';
// import {handlePGPPrivkey} from '../../src/lib/util.js';
// import {handlePGPMessage} from '../../src/lib/util.js';

import {encryptCleartextMulti} from './encryptCleartextMulti.js';
import {decryptPGPMessage} from './decryptPGPMessage.js';
import {determineContentType} from './determineContentType.js';
import {savePGPPubkey} from './savePGPPubkey.js';
import {savePGPPrivkey} from './savePGPPrivkey.js';
// import {getFromStorage} from './getFromStorage';

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
                return new Promise((resolve, reject) => {
                    determineContentType(content)(openpgp)
                    .then(contentType => {
                        if (contentType === CLEARTEXT) {
                            console.log(CLEARTEXT);
                            // encrypt
                            return encryptCleartextMulti(content)(openpgp)(localStorage)
                            .then(result => result);
                        }
                        if (contentType === PGPPRIVKEY) {
                            console.log(PGPPRIVKEY);
                            // save and broadcast converted public key
                            return savePGPPrivkey(content)(openpgp)(localStorage)
                            //return broadcastMessage(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === PGPPUBKEY) {
                            console.log(PGPPUBKEY);
                            // save to localStorage
                            return savePGPPubkey(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === PGPMESSAGE) {
                            console.log(PGPMESSAGE);
                            // get PGPKeys, decrypt,  and return
                            return decryptPGPMessage(openpgp)(localStorage)(password)(content)
                            .then(result => {
                                return result
                            })
                        }
                    })
                    .then(result => {
                        resolve(result)
                    })
                    .catch((err) => reject(err))
                })
            }
        }
    }
}
