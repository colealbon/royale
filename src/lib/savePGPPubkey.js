'use strict';

import {getFromStorage} from './getFromStorage';
import {determineContentType} from './determineContentType';
import notEmpty from '../../src/lib/notEmpty.js';
import notCleartext from '../../src/lib/notCleartext.js';
import notPGPPrivkey from '../../src/lib/notPGPPrivkey.js';
import notPGPMessage from '../../src/lib/notPGPMessage.js';

export function savePGPPubkey(openpgp) {
    // save public key to storage only if it doesn't overwrite a private key
    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (localStorage) => {
        return (!localStorage) ?
        Promise.reject('Error: missing localStorage'):
        (PGPkeyArmor) => {
            return (!PGPkeyArmor) ?
            Promise.reject('Error: missing PGPkeyArmor'):
            new Promise((resolve, reject) => {
                let PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                notEmpty(PGPkeyArmor)
                .then(() => notCleartext(PGPkeyArmor)(openpgp))
                .then(() => notPGPPrivkey(openpgp)(PGPkeyArmor))
                .then(() => notPGPMessage(PGPkeyArmor)(openpgp))
                .then(() => getFromStorage(localStorage)(PGPkey.keys[0].users[0].userId.userid))
                .then(existingKey => {
                    return (!existingKey) ?
                    Promise.resolve('none') :
                    determineContentType(openpgp)(existingKey);
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
