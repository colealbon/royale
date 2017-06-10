'use strict';
import notEmpty from '../../src/lib/notEmpty.js';
import notPGPPrivkey from '../../src/lib/notPGPPrivkey.js';

export function broadcast(content) {
    return (!content) ?
    Promise.reject(new Error('missing content')) :
    (gun) => {
        return (!gun) ?
        Promise.reject(new Error('missing gundb')) :
        (openpgp) => {
            return (!openpgp) ?
            Promise.reject(new Error('missing openpgp')) :
            notEmpty(content)
            .then((content) => {
                return notPGPPrivkey(content)(openpgp)
            })
            .then((content) => {
                return new Promise((resolve, reject) => {
                    try {
                        //var royale = gun.get('royale')
                        const id = 'royale';
                        const resultMsg = gun.get(id).put({id: content});
                        resolve(resultMsg);
                    } catch (error) {
                        reject(error);
                    }
                })
            })
        }
    }
}
