'use strict';

import {getFromStorage} from './getFromStorage';
import {decryptPGPMessageWithKey} from '../../src/lib/decryptPGPMessageWithKey.js';
import {determineContentType} from '../../src/lib/determineContentType.js';

const PGPPRIVKEY = 'PGPPrivkey';

export function decryptPGPMessage(openpgp) {
    //  usage: decryptPGPMessage(openpgp)(localStorage)(password)(PGPMessageArmor).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (localStorage) => {
        return (!localStorage) ?
        Promise.reject('Error: missing localStorage'):
        (password) => {
            return (!password) ?
            Promise.reject("Error: missing password"):
            (PGPMessageArmor) => {
                return (!PGPMessageArmor) ?
                Promise.reject('Error: missing PGPMessageArmor'):
                new Promise((resolve, reject) => {
                    getFromStorage(localStorage)()
                    .then(storeArr => {
                        try {
                            return storeArr
                            .filter(storageItem => (!storageItem) ? false : true)
                            .map(storageItem => determineContentType(storageItem)(openpgp)
                                .then(contentType => {
                                    if (contentType === PGPPRIVKEY) {
                                        decryptPGPMessageWithKey(openpgp)(password)(storageItem)(PGPMessageArmor)
                                        .then(decrypted => {
                                            resolve(decrypted)
                                        });
                                    }
                                })
                            )
                        } catch(err) {
                            reject(err);
                        }
                    })
                })
            }
        }
    }
}
