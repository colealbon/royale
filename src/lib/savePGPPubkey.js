'use strict';

import {getFromStorage} from './getFromStorage';
import {determineContentType} from './determineContentType';

export function savePGPPubkey(PGPkeyArmor) {
    // save public key to storage only if it doesn't overwrite a private key
    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
    return (!PGPkeyArmor) ?
    Promise.reject('Error: missing PGPkeyArmor'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            new Promise((resolve, reject) => {
                let PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                getFromStorage(localStorage)(PGPkey.keys[0].users[0].userId.userid)
                .then(existingKey => {
                    return (!existingKey) ?
                    Promise.resolve('none') :
                    determineContentType(existingKey)(openpgp);
                })
                .then(existingKeyType => {
                    if (existingKeyType === 'PGPPrivkey'){
                        resolve('pubkey ignored X- attempted overwrite privkey')
                    } else {
                        localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor)
                        resolve(`public pgp key saved <- ${PGPkey.keys[0].users[0].userId.userid}`)
                    }
                })
                .catch((err) => reject(err))
            })
        }
    }
}
