'use strict';
import notEmpty from '../../src/lib/notEmpty.js';
import notPGPPrivkey from '../../src/lib/notPGPPrivkey.js';

export function broadcast(openpgp) {
    return (!openpgp) ?
    Promise.reject(new Error('missing openpgp')) :
    (gun) => {
        return (!gun) ?
        Promise.reject(new Error('missing gundb')) :
        (content) => {
            return (!content) ?
            Promise.reject(new Error('missing content')) :
            notEmpty(content)
            .then((content) => {
                return notPGPPrivkey(openpgp)(content)
            })
            .then((content) => {
                return new Promise((resolve, reject) => {
                    try {
                        let putResult = gun.get('message').put({message: content});
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
            })
        }
    }
}
