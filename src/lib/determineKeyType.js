'use strict';

export function determineKeyType(content) {
    return (!content) ?
    Promise.reject('Error: missing pgpKey'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        new Promise((resolve, reject) => {
            const PGPPUBKEY = 'PGPPubkey';
            const PGPPRIVKEY = 'PGPPrivkey';
            try {
                let privateKeys = openpgp.key.readArmored(content)
                let privateKey = privateKeys.keys[0]
                if (privateKey.toPublic().armor() !== privateKey.armor() ) {
                    resolve(PGPPRIVKEY);
                } else {
                    resolve(PGPPUBKEY);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}
