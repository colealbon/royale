'use strict';
import notEmpty from '../../src/lib/notEmpty.js';
import notPGPPrivkey from '../../src/lib/notPGPPrivkey.js';

export function broadcast(thecontent) {
    return (!thecontent) ?
    Promise.reject(new Error('missing content')) :
    (gun) => {
        return (!gun) ?
        Promise.reject(new Error('missing gundb')) :
        (openpgp) => {
            return (!openpgp) ?
            Promise.reject(new Error('missing openpgp')) :
            notEmpty(thecontent)
            .then(notPGPPrivkey(thecontent)(openpgp))
            .then(() => {
                return new Promise((resolve, reject) => {
                    try {
                        let putResult = gun.get('message').put({message: thecontent});
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
            })
            .catch((err) => Promise.reject(err))
        }
    }
}
