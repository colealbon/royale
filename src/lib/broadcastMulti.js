'use strict';
import notEmpty from '../../src/lib/notEmpty.js';
import notPGPPrivkey from '../../src/lib/notPGPPrivkey.js';

export function broadcastMulti(content) {
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
                        const id = 'royale';
                        let broadcastQueue = [];
                        content.map((message) => {
                            broadcastQueue.push(broadcast(message)(gun)(openpgp))
                        })
                        Promise.all(broadcastQueue, (result) => resolve(result));
                    } catch (error) {
                        reject(error);
                    }
                })
            })
        }
    }
}
