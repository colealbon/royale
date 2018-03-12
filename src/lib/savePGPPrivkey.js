'use strict';

export function savePGPPrivkey(openpgp) {
    // save private key to storage no questions asked
    // usage: savePGPPrivkey(content)(openpgp)(localStorage).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (localStorage) => {
        return (!localStorage) ?
        Promise.reject('Error: missing localStorage'):
        (PGPkeyArmor) => {
            return (!PGPkeyArmor) ?
            Promise.reject('Error: missing PGPkeyArmor'):
            new Promise((resolve, reject) => {
                try {
                    let PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                    localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor)
                    process.setImmediate(
                        resolve(`private pgp key saved <- ${PGPkey.keys[0].users[0].userId.userid}`)
                    )
                } catch(err) {
                    reject(err);
                }
            })
        }
    }
}
