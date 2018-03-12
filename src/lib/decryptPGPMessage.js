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
                    let decryptQueue = [];
                    getFromStorage(localStorage)()
                    .then(storeArr => {
                        try {
                            storeArr
                            .map(storageItem => {
                                try {
                                    determineContentType(openpgp)(storageItem)
                                    .then(contentType => {
                                        console.log('contentType', contentType)
                                        if (contentType === PGPPRIVKEY) {
                                            console.log('privateKey')
                                            decryptQueue.push(decryptPGPMessageWithKey(openpgp)(password)(storageItem)(PGPMessageArmor))
                                        }
                                    })
                                } catch (error) {}
                            })
                            process.nextTick(() => {
                                Promise.all(decryptQueue)
                                .then((decryptedArr) => {
                                    resolve(decryptedArr[0])
                                })
                            })
                        } catch(err) {
                            reject(err);
                        }
                    })
                })
            }
        }
    }
}
