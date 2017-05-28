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
                    getFromStorage(localStorage)()
                    .then((storageArr) => {
                        //let publicKeyArr = [];
                        let encryptedMsgs = [];
                        let i = storageArr.length;
                        let idx = 0;
                        storageArr
                        .map((storageItem) => {
                            i--;
                            return storageItem;
                        })
                        .filter(storageItem => (!storageItem) ? false : true)
                        .map((storageItem) => {
                            determineContentType(storageItem)(openpgp)
                            .then((contentType) => {
                                if (contentType === PGPPUBKEY) {
                                    encryptClearText(openpgp)(storageItem)(content)
                                    .then((encrypted) => {
                                        encryptedMsgs[idx] = encrypted;
                                        idx++;
                                        if (i === 0) {
                                            resolve(encryptedMsgs);
                                        }
                                    })
                                }
                            })
                        })
                    })
                } catch (err) {
                    reject (new Error (err));
                }
            })
        }
    }
}
