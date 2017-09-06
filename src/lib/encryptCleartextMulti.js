'use strict';

import {getFromStorage} from './getFromStorage';
import {determineContentType} from './determineContentType';
import {encryptClearText} from './encryptClearText';

const PGPPUBKEY = 'PGPPubkey';

export function encryptCleartextMulti(content) {
    // usage: encryptCleartextMulti(content)(openpgp)(localStorage).then(result => result)
    return (!content) ?
    Promise.reject('Error: missing content'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            new Promise((resolve, reject) => {
                try {
                    let encryptQueue = [];
                    getFromStorage(localStorage)()
                    .then((storageArr) => {
                        storageArr
                        .map((storageItem) => {
                            try {
                                determineContentType(storageItem)(openpgp)
                                .then((contentType) => {
                                    if (contentType === PGPPUBKEY) {
                                        encryptQueue.push(encryptClearText(openpgp)(storageItem)(content))
                                    }
                                })
                            } catch (error) {}
                        })
                    })
                    process.nextTick(() => {
                        Promise.all(encryptQueue)
                        .then((encryptedArr) => {
                            resolve(encryptedArr)
                        })
                    })
                } catch (err) {
                    reject (new Error (err));
                }
            })
        }
    }
}
